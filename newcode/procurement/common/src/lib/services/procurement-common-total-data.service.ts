/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityBase, IEntityIdentification, IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { ServiceRole } from '@libs/platform/data-access';


import { inject } from '@angular/core';
import { ProcurementCommonTotalReadonlyProcessorService } from './processors/procurement-common-total-readonly-processor.service';
import { FieldKind, IPropertyChangedEvent, PrcSharedTotalTypeLookupService, ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementCommonVatPercentageService } from './procurement-common-vat-percentage.service';
import { MainDataDto } from '@libs/basics/shared';
import { IExchangeRateChangedEvent, IPrcHeaderDataService } from '../model/interfaces';
import { IReadonlyRootService } from '@libs/procurement/shared';
import { ProcurementTotalKind } from '../model/enums';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * The basic data service for procurement total entity
 */
export abstract class ProcurementCommonTotalDataService<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	/**
	 * List all entities or not
	 */
	public isListAll = true;

	protected createdTotals: T[] = [];
	protected abstract internalModuleName: ProcurementInternalModule;
	protected readonly http = inject(PlatformHttpService);

	private readonly vatService = inject(ProcurementCommonVatPercentageService);
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);
	private readonly readonlyProcessor: ProcurementCommonTotalReadonlyProcessorService<T,PT, PU>;

	protected constructor(
		public parentService: IPrcHeaderDataService<PT, PU> & IReadonlyRootService<PT, PU>,
		protected config: {
			apiUrl: string;
			itemName?: string;
			readInfo?: IDataServiceEndPointOptions;
			createInfo?: IDataServiceEndPointOptions;
			isPackage?: boolean;
		},
	) {
		// set default itemName 'Total'
		config.itemName = config.itemName || 'Total';

		const options: IDataServiceOptions<T> = {
			apiUrl: config.apiUrl,
			readInfo: {
				endPoint: 'list',
				usePost: false,
				...config.readInfo,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const parent = this.parentService.getSelectedEntity()!;
					return {
						MainItemId: this.getMainItemId(parent),
						PrcConfigurationFk: this.parentService.getHeaderEntity().ConfigurationFk,
						ExistsTypes: this.getList().map((entity) => {
							return entity.TotalTypeFk;
						}),
					};
				},
				...config.createInfo,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: config.itemName,
				parent: parentService,
			},
		};

		super(options);
		this.readonlyProcessor = new ProcurementCommonTotalReadonlyProcessorService(this, config.isPackage);
		this.processor.addProcessor(this.readonlyProcessor);
		this.init();
	}

	protected init() {
		this.parentService.exchangeRateChanged$.subscribe((e) => {
			this.onParentExchangeRateChanged(e);
		});
		this.parentService.entityProxy.propertyChanged$.subscribe((e) => {
			switch (e.fieldKind) {
				case FieldKind.MdcTaxCodeFk:
					this.onParentTaxCodeOrVatGroupChanged(e);
					break;
				case FieldKind.MdcVatGroupFk:
					this.onParentTaxCodeOrVatGroupChanged(e);
					break;
			}
		});
	}

	/*
	 *  recalculate total value when exchange rate change
	 */
	protected async onParentExchangeRateChanged(e: IExchangeRateChangedEvent) {
		const exchangeRate = e.exchangeRate;
		this.getList().forEach((item) => {
			if (item.TotalKindFk === ProcurementTotalKind.FreeTotal && exchangeRate !== 0) {
				item.ValueNet = item.ValueNetOc / exchangeRate;
				item.GrossOc = item.ValueNetOc + item.ValueTaxOc;
				item.ValueTax = item.ValueTaxOc / exchangeRate;
				item.Gross = item.ValueNet + item.ValueTax;
				this.setModified(item);
			}

			if (item.TotalKindFk === ProcurementTotalKind.CalculatedCost || item.TotalKindFk === ProcurementTotalKind.EstimateTotal) {
				item.ValueNetOc = item.ValueNet * exchangeRate;
				item.ValueTaxOc = item.ValueTax * exchangeRate;
				item.GrossOc = item.ValueNetOc + item.ValueTaxOc;
				item.Gross = item.ValueNet + item.ValueTax;
				this.setModified(item);
			}
		});
	}

	/*
	 *  recalculate total value when tax code or vat group change
	 */
	protected async onParentTaxCodeOrVatGroupChanged(e: IPropertyChangedEvent<PT>) {
		const headerContext = this.parentService.getHeaderContext();
		const vatPercent = this.getVatPercent();
		this.getList().forEach((item) => {
			if (e.newValue) {
				if (item.TotalKindFk === ProcurementTotalKind.FreeTotal && headerContext.exchangeRate !== 0) {
					item.ValueTaxOc = item.ValueNetOc * (vatPercent / 100);
					item.GrossOc = item.ValueNetOc + item.ValueTaxOc;
					item.ValueTax = item.ValueTaxOc / headerContext.exchangeRate;
					item.Gross = item.ValueNet + item.ValueTax;
					this.setModified(item);
				}

				if (item.TotalKindFk === ProcurementTotalKind.CalculatedCost || item.TotalKindFk === ProcurementTotalKind.EstimateTotal) {
					item.ValueTax = item.ValueNet * (vatPercent / 100);
					item.ValueTaxOc = item.ValueTax * headerContext.exchangeRate;
					item.GrossOc = item.ValueNetOc + item.ValueTaxOc;
					item.Gross = item.ValueNet + item.ValueTax;
					this.setModified(item);
				}
			}
		});
	}

	/**
	 * Get MainItemId from parent entity
	 * @param parent
	 * @protected
	 */
	protected getMainItemId(parent: PT): number {
		return parent.Id!;
	}

	/**
	 * Get exchange rate from header
	 * @protected
	 */
	public abstract getExchangeRate(): number;

	public async processData(data: T) {
		await this.readonlyProcessor.updateEntityReadonly(data);
	}

	public override loadSubEntities(identificationData: IIdentificationData): Promise<void> {
		const rootEntity = this.parentService.getList().find((c) => c.Id === identificationData.pKey1) as IEntityBase;
		if (rootEntity && rootEntity.Version === 0) {
			//TODO it is only a workaround here. Should enhance it in framework.
			this.setList(this.createdTotals);
			this.setModified(this.createdTotals);

			return Promise.resolve();
		}
		return super.loadSubEntities(identificationData);
	}

	public recalculate() {
		const header = this.parentService.getSelectedEntity();
		if (header) {
			this.parentService.save().then(() => {
				this.http
					.get<boolean>('procurement/common/headertotals/recalculate', {
						params: {
							headerId: header.Id,
							moduleName: this.internalModuleName,
						},
					})
					.then((success) => {
						if (success) {
							this.load({ id: 0, pKey1: header.Id }).then((list) => {

								this.setList(list);
								this.readonlyProcessor.updateEntityListReadonly();
							});
						}
					});
			});
		}
	}

	public toggleListAll() {
		this.isListAll = !this.isListAll;
		const header = this.parentService.getSelectedEntity();
		if (header) {
			this.parentService.save().then(() => {
				this.load({ id: 0, pKey1: header.Id }).then((list) => {
					this.setList(list);
				});
			});
		}
	}

	public getVatPercent(taxCodeFk?: number, vatGroupFk?: number) {
		return this.vatService.getVatPercent(taxCodeFk, vatGroupFk);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getMainItemId(parent),
			ConfigurationFk: this.parentService.getHeaderEntity().ConfigurationFk,
			ShowAll: this.isListAll,
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = new MainDataDto<T>(loaded);
		return dto.Main;
	}

	public getNetTotalItem(): T | undefined {
		return this.getList().find((item) => {
			return item.TotalKindFk === ProcurementTotalKind.NetTotal;
		});
	}

	public isReadonly(): boolean {
		const prcHeaderContext = this.parentService.getHeaderContext();
		return prcHeaderContext.readonly;
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.isReadonly();
	}

	public getTotalType(item: T) {
		return this.prcTotalTypeLookupService.cache.getItem({ id: item.TotalTypeFk });
	}

	public override canDelete(): boolean {
		const currentEntity = this.getSelectedEntity();

		if (currentEntity) {
			return !this.isReadonly() && currentEntity.TotalKindFk !== ProcurementTotalKind.NetTotal;
		}

		return false;
	}
}
