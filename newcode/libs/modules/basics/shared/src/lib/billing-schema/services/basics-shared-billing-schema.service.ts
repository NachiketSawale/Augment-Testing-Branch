/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { DataServiceFlatLeaf, DataServiceFlatRoot, DataServiceHierarchicalRoot, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, IParentRole, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { ICommonBillingSchemaEntity } from '../model/interfaces/common-billing-schema-entity.interface';
import { MainDataDto } from '../../model/dtoes/main-data-dto.class';
import { CommonBillingSchemaReadonlyProcessorService } from './basics-shared-billing-schema-readonly-processor.service';
import { set } from 'lodash';
import { IReculateUrlParameter } from '../model/interfaces/reculate-url-parameter.interface';

/**
 * The basic share common billing schema data service
 */
export abstract class CommonBillingSchemaDataService<T extends ICommonBillingSchemaEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly configurationService = inject(PlatformConfigurationService);
	public readonly readonlyProcessor: CommonBillingSchemaReadonlyProcessorService<T, PT, PU>;
	private items: T[] = [];
	protected apiUrl: string;

	protected constructor(
		public parentService: DataServiceFlatRoot<PT, PU> | DataServiceHierarchicalRoot<PT, PU> | (IEntitySelection<PT> & IParentRole<PT, PU>),
		protected qualifier: string,
		protected customizeAPIUrl?: string,
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: customizeAPIUrl || 'basics/billingschema/common',
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'BillingSchema',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};

		super(options);

		this.apiUrl = options.apiUrl;
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	/**
	 * Create readonly processor
	 * @protected
	 */
	protected createReadonlyProcessor() {
		return new CommonBillingSchemaReadonlyProcessorService(this);
	}

	/**
	 * Override load succeeded
	 * @param loaded
	 * @protected
	 */
	protected override onLoadSucceeded(loaded: object): T[] {
		this.items = new MainDataDto<T>(loaded).Main;
		return this.filterHiddenItems(this.items);
	}

	/**
	 * Register the modifications to the parent update
	 * @param parentUpdate
	 * @param modified
	 * @param deleted
	 */
	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]): void {
		if (modified && modified.length > 0) {
			set(parentUpdate, `${this.options.roleInfo.itemName}ToSave`, modified);
		}
		if (deleted && deleted.length > 0) {
			set(parentUpdate, `${this.options.roleInfo.itemName}ToDelete`, deleted);
		}
	}

	/**
	 * merge all the loaded billing schema including the hidden items.
	 */
	protected getAllBillingSchemas(): T[] {
		return this.items;
	}

	/**
	 * set the disable logic here, subclasses can rewrite it to implement their own custom logic
	 */
	public disableRecalculateButton(): boolean {
		return !this.parentService.getSelectedEntity() || this.isParentEntityReadyOnly();
	}

	/**
	 * recalculate Billing Schema when recalculate button is clicked
	 */
	public async recalculate() {
		if (this.parentService instanceof DataServiceFlatRoot || this.parentService instanceof DataServiceHierarchicalRoot) {
			//When saving the parent entity, the billing schema will be recalculated.
			await this.parentService.updateAndExecute(async () => {
				//If there is nothing modified the saving will not be triggered, as a result we need duplicate the recalculate process again.
				//Or the framework need to be enhanced that the saving is really taken place or not.
				const billingSchemas = await this.doRecalculateBillingSchema();

				this.updateBillingSchema(billingSchemas, false);
			});
		} else {
			throw new Error('The parent service is not a root service, please override the recalculate method');
		}
	}

	/**
	 * Implement this method for each module to recalculate the billing schema.
	 */
	protected abstract doRecalculateBillingSchema(): Promise<T[]>;

	/**
	 * regenerate the billing items from billing schema
	 * It will delete the current loaded data and fill with the new generated billing schema.
	 */
	public async regenerateBillingSchema(parent: PT) {
		const reqParams = this.getRegenerateUrl();

		if (reqParams) {
			const items = this.getList().filter((i) => i.HeaderFk === parent.Id);

			if (items && items.length > 0) {
				this.delete(items); // delete all items in same HeaderFK
			}

			const response = await this.http.get<MainDataDto<T>>(reqParams.baseUrl, { params: reqParams.params });

			const billingSchemas = response.Main;

			this.mergeFromExistedBillingSchema(billingSchemas, items);
			this.updateBillingSchema(billingSchemas, true);
		}
	}

	private mergeFromExistedBillingSchema(newItems: T[], existedItems: T[]) {
		newItems.forEach((item) => {
			if (newItems.length > 0) {
				const oldBillingSchema = existedItems.find((i) => i.IsEditable && i.MdcBillingSchemaDetailFk === item.MdcBillingSchemaDetailFk);
				if (oldBillingSchema) {
					item.Description = oldBillingSchema.Description;
					item.Description2 = oldBillingSchema.Description2;
					item.CodeRetention = oldBillingSchema.CodeRetention;
					item.Value = oldBillingSchema.Value;
				}
			}
		});
	}

	/**
	 * After a successful recalculation, can be overridden by the subclass after billing schema recalculated is done
	 * @param _billingSchemas
	 */
	protected onRecalculateSucceeded(_billingSchemas: T[]): void {}

	/**
	 * the hidden items not show in container
	 * @param items
	 */
	public filterHiddenItems(items: T[]): T[] {
		return items.filter((i) => !i.IsHidden);
	}

	/**
	 * Check if the parent entity is read only
	 */
	public isParentEntityReadyOnly(): boolean {
		const parentEntity = this.parentService.getSelectedEntity();
		if (parentEntity) {
			if (this.parentService instanceof DataServiceFlatRoot || this.parentService instanceof DataServiceHierarchicalRoot) {
				return this.parentService.isEntityReadOnly(parentEntity);
			} else {
				throw new Error('should override this isParentEntityReadyOnly method');
			}
		}

		return true;
	}

	/**
	 * if the billing schema fk is changed, then need to call this function
	 * @param parent the parent entity
	 */
	public onBillingSchemaChanged(parent: PT): void {
		this.regenerateBillingSchema(parent).then();
	}

	/**
	 * The controlling unit lookup requires this option; the default is set to false. It will be set to true in PES and invoice modules
	 */
	public get IsControllingUnitLookupExtraFilter(): boolean {
		return false;
	}

	/**
	 * get the exchange rate, Different modules may have different exchange rates
	 * @param parent the parent entity
	 */
	public abstract getExchangeRate(parent: PT): number;

	/**
	 * get billing schema id from parent entity
	 * @param parent the parent entity
	 * @protected
	 */
	protected abstract getParentBillingSchemaId(parent: PT): number;

	/**
	 * get rubric category id from parent entity
	 * @param parent the parent entity
	 * @protected
	 */
	protected abstract getRubricCategory(parent: PT): number;

	/**
	 * get regenerate billing schema url, difference module use special recalculate logic
	 */
	protected getRegenerateUrl(): IReculateUrlParameter | null {
		const headerEntity = this.parentService.getSelectedEntity();

		if (headerEntity) {
			const rubCategoryFk = this.getRubricCategory(headerEntity);
			const baseUrl = this.apiUrl + '/reloadBillItems';
			const billingSchemaId = this.getParentBillingSchemaId(headerEntity);
			return { baseUrl: baseUrl, params: { HeaderFK: headerEntity.Id, billingSchemaFk: billingSchemaId, rubricCategoryFk: rubCategoryFk, qualifier: this.qualifier } };
		}

		return null;
	}

	private updateBillingSchema(billingSchemas: T[], isCreate: boolean) {
		this.items = billingSchemas;
		const itemsShown = this.filterHiddenItems(billingSchemas);

		this.processor.process(itemsShown);
		this.setList(itemsShown);

		if (isCreate) {
			this.setModified(billingSchemas);
		}

		this.onRecalculateSucceeded(billingSchemas);
	}
}
