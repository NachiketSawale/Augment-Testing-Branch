/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IMaterialCatalogLookupEntity } from '@libs/basics/interfaces';
import { BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedDataValidationService, BasicsSharedLookupOverloadProvider, BasicsSharedMaterialCatalogLookupService, BasicsSharedMaterialCatalogTypeLookupService, BasicsSharedPaymentTermLookupService, BasicsSharedWICTypeLookupService, CurrencyEntity } from '@libs/basics/shared';
import { BoqCompositeConfigService, BoqCompositeDataService } from '@libs/boq/main';
import { IWicBoqCompositeEntity } from '@libs/boq/interfaces';
import { BusinessPartnerLookupService, BusinesspartnerSharedCustomerLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { IInitializationContext, Permissions, PlatformPermissionService, prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { BaseValidationService, EntityDomainType, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityProcessor, IEntityRuntimeDataRegistry, IValidationFunctions, ServiceRole, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { ContainerLayoutConfiguration, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { createLookup, FieldType, ILookupContext, ItemType } from '@libs/ui/common';
import { BoqItemDataService } from '@libs/boq/main';
import { IWicGroupEntity } from '../model/entities/wic-group-entity.interface';
import { WicGroupComplete } from '../model/wic-group-complete.class';
import { WicGroupDataService } from './boq-wic-group.service';
import { ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

@Injectable({providedIn: 'root'})
export class WicBoqDataService extends BoqCompositeDataService<IWicBoqCompositeEntity, IWicBoqCompositeEntity, IWicGroupEntity, WicGroupComplete> {
	// This data service is in a node role according to the base class which is caused by its usages in the sales and procuremt modules.
	// This data service actually is in a leaf role. Therfor the generic parameter 1 and 2 are the same and the 'ToSave' property in 'WicGroupComplete' is a leaf property.

	private boqItemDataService: BoqItemDataService;
	private wicGroupDataService: WicGroupDataService;
	private platformPermissionService: PlatformPermissionService;
	private wicTypeLookupService : BasicsSharedWICTypeLookupService<IWicBoqCompositeEntity>;
	private boqWicBoqReadonlyProcessor: WicBoqReadonlyProcessor<IWicBoqCompositeEntity>;

	public constructor(wicGroupDataService : WicGroupDataService) {

		const readOnlyProcessor = new WicBoqReadonlyProcessor();

		const options: IDataServiceOptions<IWicBoqCompositeEntity> = {
			apiUrl: 'boq/wic/boq',
			roleInfo: <IDataServiceRoleOptions<IWicBoqCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'WicBoqComposite',
				parent: wicGroupDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			processors: [readOnlyProcessor]
		};

		super(options);

		this.boqItemDataService = inject(BoqItemDataService);
		this.wicGroupDataService = inject(WicGroupDataService);
		this.platformPermissionService = inject(PlatformPermissionService);
		this.wicTypeLookupService = inject(BasicsSharedWICTypeLookupService<IWicBoqCompositeEntity>);
		this.wicTypeLookupService.getList(); // TODO-BOQ: This shall be a preloading of the wic type data to be able to synchronously access the data later on. Not sure if this works as expected.
		this.boqWicBoqReadonlyProcessor = readOnlyProcessor;
		this.boqWicBoqReadonlyProcessor.setDataService(this);
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		const selectedWicGroup = this.getSelectedParent();
		if(selectedWicGroup){
			return { wicGroupId: selectedWicGroup.Id };
		} else {
			throw new Error('There should be a selected parent wic group to load the corresponding wic boqs');
		}
	}

	protected override onLoadSucceeded(loadedWicBoqs: IWicBoqCompositeEntity[]): IWicBoqCompositeEntity[] {
		const selectedWicGroup = this.getSelectedParent() as IWicGroupEntity;
		let readOnly = false;

		if (selectedWicGroup) {
			if (selectedWicGroup.AccessRightDescriptorFk === null) {
				this.setReadOnly(false);
				this.boqItemDataService.setReadOnly(false);
			}	else {
				// As we have an AccessRightDescriptorFk set and hopefully the related permissions already loaded by parent service, we should be able to check the access rights.
				if(selectedWicGroup.AccessRightDescriptorFk) {
					readOnly = this.platformPermissionService.has(selectedWicGroup.AccessRightDescriptorFk, Permissions.Read) && !this.platformPermissionService.has(selectedWicGroup.AccessRightDescriptorFk, Permissions.Write);
				}

				this.setReadOnly(readOnly);
				this.boqItemDataService.setReadOnly(this.getReadOnly());
			}
		}

		this.selectFromNavigation(loadedWicBoqs);

		return loadedWicBoqs;
	}

	protected override provideCreatePayload(): object {
		const wicGroup = this.getSelectedParent();
		if (wicGroup) {
			const newReference = this.createNextReferenceNumber();
			return {
				WicGroupId: wicGroup.Id,
				Reference: newReference
			};
		}

		return {};
	}

	protected override onCreateSucceeded(created: IWicBoqCompositeEntity): IWicBoqCompositeEntity {
		return created;
	}

	public override isParentFn(wicGroup: IWicGroupEntity, wicBoqComposite: IWicBoqCompositeEntity): boolean {
		return wicBoqComposite.WicBoq?.WicGroupFk === wicGroup.Id;
	}

	public override createUpdateEntity(modifiedWicBoq: IWicBoqCompositeEntity): IWicBoqCompositeEntity {
		return modifiedWicBoq;
	}

	public override registerNodeModificationsToParentUpdate(complete: WicGroupComplete, modified: IWicBoqCompositeEntity[], deleted: IWicBoqCompositeEntity[]) {
		if (modified.length > 0) {
			complete.WicBoqCompositeToSave = modified;
		}
		if (deleted.length > 0) {
			complete.WicBoqCompositeToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: WicGroupComplete): IWicBoqCompositeEntity[] {
		return complete.WicBoqCompositeToSave || [];
	}

	// #endregion
	//  endregion

	protected selectFromNavigation(items: IWicBoqCompositeEntity[]) {
		const selectedItemId = this.wicGroupDataService.getSelectedWicBoqId();
		if (selectedItemId) {
			const selectedItem = items.find(item => item.Id === selectedItemId);
			if (selectedItem) {
				this.select(selectedItem);
			}
			this.wicGroupDataService.clearSelectedWicBoqId();
		}
	}

	/**
	 * @ngdoc function
	 * @name getCellEditable
	 * @function
	 * @methodOf boqWicBoqService
	 * @description Check if the given field in the currentItem should be editable
	 * @param {Object} currentCompositeItem whose field is to be checked
	 * @param {String} fieldName name of the field that is checked
	 * @returns {Boolean} result of check
	 */
	public getCellEditable(currentCompositeItem: IWicBoqCompositeEntity, fieldName: string): boolean {

		// Various fields have to be set readonly according to the state of the current item
		return this.boqWicBoqReadonlyProcessor.isFieldEditable(currentCompositeItem, fieldName);
	}

	/**
	 * @ngdoc function
	 * @name isFrameworkWicBoq
	 * @function
	 * @methodOf boqWicBoqService
	 * @description Check if the given wicBoqComposite holds a framework wic boq
	 * @param {Object} wicBoqComposite wic cat boq that is to be checked
	 * @returns {Boolean} result of check
	 */
	public isFrameworkWicBoq(wicBoqComposite: IWicBoqCompositeEntity): boolean {
		let isFrameworkWicBoq = false;

		if (wicBoqComposite.WicBoq && (wicBoqComposite.WicBoq.ConHeaderFk !== null || wicBoqComposite.WicBoq.OrdHeaderFk !== null)) {

			const wicTypes = this.wicTypeLookupService.syncService?.getListSync();

			const foundWicType = wicTypes?.find( type => {
				return type.Id === wicBoqComposite.WicBoq?.MdcWicTypeFk;
			});

			if(foundWicType && foundWicType.IsFramework) {
				isFrameworkWicBoq = true;
			}
		}

		return isFrameworkWicBoq;
	}
}

@Injectable({providedIn: 'root'})
export class WicBoqBehavior implements IEntityContainerBehavior<IGridContainerLink<IWicBoqCompositeEntity>, IWicBoqCompositeEntity> {
	private dataService: WicBoqDataService;
	private boqItemDataService: BoqItemDataService;
	private router: Router;

	public constructor() {
		this.dataService = inject(WicBoqDataService);
		this.boqItemDataService = inject(BoqItemDataService);
		this.router = inject(Router);
	}

	public onCreate(containerLink: IGridContainerLink<IWicBoqCompositeEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
		  {
		    id: 'gotoBoqMain',
		    caption: 'boq.main.openBoq',
		    iconClass: ' tlb-icons ico-goto',
		    type: ItemType.Item,
		    fn: () => {
				const selectedWicBoq = this.dataService.getSelectedEntity() ?? null;

				if (selectedWicBoq) {
					// TODO-BOQ: Manipulate the 2 values to simulate a project boq
					this.boqItemDataService.setSelectedBoqHeaderId(selectedWicBoq.BoqHeader.Id);
					this.boqItemDataService.setSelectedProjectId(1); // TODO-BOQ: To be deleted, just make sense in a project boq.

					this.boqItemDataService.setList([]); // TODO-BOQ: Currently the WIC BOQ items are not loaded directly (refresh button must be pressed) but cached
					this.router.navigateByUrl('/boq/main'); // The change to the boq main module is called instantly to have a better user experience.
				}
		    }
		  }
		]);
	}
}

@Injectable({providedIn: 'root'})
export class WicBoqConfigService extends BoqCompositeConfigService<IWicBoqCompositeEntity> {
	protected properties = {
		...this.getBoqItemProperties(false),
		...this.getBoqHeaderProperties(),
		...{
			'WicBoq.MdcMaterialCatalogFk': { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.CopyTemplateOnly':     { domain: EntityDomainType.Boolean, mandatory: true  },
			'WicBoq.BpdBusinessPartnerFk': { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BpdSubsidiaryFk':      { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BpdSupplierFk':        { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BasPaymentTermFk':     { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BasClerkFk':           { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.MdcWicTypeFk':         { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.ValidFrom':            { domain: EntityDomainType.Date,    mandatory: true  },
			'WicBoq.ValidTo':              { domain: EntityDomainType.Date,    mandatory: true  },
			'WicBoq.BasPaymentTermFiFk':   { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BasPaymentTermAdFk':   { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.ConHeaderFk':          { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.OrdHeaderFk':          { domain: EntityDomainType.Integer, mandatory: false },
			'WicBoq.BpdCustomerFk':        { domain: EntityDomainType.Integer, mandatory: false },
		}
	};

	protected override getLabels(): {[key: string]: Translatable} {
		return {
			...super.getLabels(),
			...prefixAllTranslationKeys('cloud.common.', {
				'WicBoq.BpdBusinessPartnerFk': 'entityBusinessPartner',
				'WicBoq.BpdSubsidiaryFk':      'entitySubsidiary',
				'WicBoq.BpdSupplierFk':        'entitySupplierCode',
				'WicBoq.BasPaymentTermFk':     'entityPaymentTermPA',
				'WicBoq.BasPaymentTermFiFk':   'entityPaymentTermFI',
				'WicBoq.BasPaymentTermAdFk':   'entityPaymentTermAD',
				'WicBoq.ConHeaderFk':          'entityContract',
				'WicBoq.BpdCustomerFk':        'entityCustomer',
				'WicBoq.ValidFrom':            'entityValidFrom',
				'WicBoq.ValidTo':              'entityValidTo',
			}),
			...prefixAllTranslationKeys('boq.wic.', {
				'WicBoq.CopyTemplateOnly':     'CopyTemplateOnly',
				'WicBoq.MdcMaterialCatalogFk': 'MdcMaterialCatalogFk',
				'WicBoq.OrdHeaderFk':          'OrdHeaderFk'
			}),
			...prefixAllTranslationKeys('procurement.contract.', {
				'WicBoq.BasClerkFk': 'ConHeaderProcurementOwnerCode'
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				'WicBoq.MdcWicTypeFk': 'wictype'
			})
		};
	}

	public getWicBoqLayoutConfiguration(ctx: IInitializationContext): ContainerLayoutConfiguration<IWicBoqCompositeEntity> {
		return {
			groups: this.getLayoutGroups(),
			labels: this.getLabels(),
			additionalOverloads: {
				...this.getOverloads(),
				'BoqHeader.BasCurrencyFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IWicBoqCompositeEntity, CurrencyEntity>({ dataServiceToken: BasicsSharedCurrencyLookupService })
				},
				'WicBoq.BpdBusinessPartnerFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BusinessPartnerLookupService, displayMember: 'BusinessPartnerName1' })
				},
				'WicBoq.BpdSupplierFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSupplierLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-supplier-common-filter',
							execute(context: ILookupContext<ISupplierLookupEntity, IWicBoqCompositeEntity>) {
								return {
									BusinessPartnerFk: context.entity && context.entity.WicBoq ? context.entity.WicBoq.BpdBusinessPartnerFk : null,
									SubsidiaryFk: context.entity && context.entity.WicBoq ? context.entity.WicBoq.BpdSubsidiaryFk : null,
								};
							}
						},
					})
				},
				'WicBoq.BpdSubsidiaryFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, IWicBoqCompositeEntity>) {
								return {
									BusinessPartnerFk: context.entity && context.entity.WicBoq ? context.entity.WicBoq.BpdBusinessPartnerFk : null,
									SupplierFk: context.entity && context.entity.WicBoq ? context.entity.WicBoq.BpdSupplierFk : null,
								};
							}
						},
					}),
				},
				'WicBoq.BpdCustomerFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BusinesspartnerSharedCustomerLookupService, displayMember: 'BusinessPartnerName1', showClearButton: true })
				},
				'WicBoq.MdcWicTypeFk': BasicsSharedCustomizeLookupOverloadProvider.provideWICTypeLookupOverload(true),
				'WicBoq.BasPaymentTermFiFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BasicsSharedPaymentTermLookupService, showClearButton: true })
				},
				'WicBoq.BasPaymentTermFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BasicsSharedPaymentTermLookupService, showClearButton: true })
				},
				'WicBoq.BasPaymentTermAdFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BasicsSharedPaymentTermLookupService, showClearButton: true })
				},
				'WicBoq.ConHeaderFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({ dataServiceToken: ProcurementShareContractLookupService, showDescription: true, descriptionMember: 'Description' })
				},
				// Todo-BOQ: Currently there is no sales contract module implemented nor a corresponding lookup service.
				// Todo-BOQ: Once this is done, we can attach this lookup here
				// OrdHeaderFk: {}

				// Todo-BOQ: Usually we should filter here to all material catalogs that are assigned to the "Framework Agreement" type, but this doesn't seem to be possible at the moment.
				// Todo-BOQ: So we currently set this field to readonly to ensure not wrong material catalogs are set here.
				'WicBoq.MdcMaterialCatalogFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialCatalogLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						clientSideFilter: {
							execute(item: IMaterialCatalogLookupEntity): boolean {
								// Only return those catalogs that have the IsFramework flag set.
								const materialCatTypeLookupService = ctx.injector.get(BasicsSharedMaterialCatalogTypeLookupService);
								const materialCatalogTypes: any = materialCatTypeLookupService.syncService?.getListSync();
								const materialCatalogType = materialCatalogTypes?.find((e: any) => e.Id == item.MaterialCatalogTypeFk);
								return materialCatalogType !== null && materialCatalogType !== undefined && materialCatalogType.IsFramework;
							}
						}
					}),
					// readonly: true
				},
				'WicBoq.BasClerkFk': BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			},
		};
	}
}

/**
 * Wic Boq validation service
 */
@Injectable({providedIn: 'root'})
export class WicBoqValidationService extends BaseValidationService<IWicBoqCompositeEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private wicBoqDataService = inject(WicBoqDataService);

	protected generateValidationFunctions(): IValidationFunctions<IWicBoqCompositeEntity> {
		return {
			'BoqRootItem.Reference': this.validateIsMandatory,
			'WicBoq.ValidFrom': this.validateValidFrom,
			'WicBoq.ValidTo': this.validateValidTo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWicBoqCompositeEntity> {
		return this.wicBoqDataService;
	}

	private validateValidFrom(info: ValidationInfo<IWicBoqCompositeEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.WicBoq?.ValidTo ? info.entity.WicBoq?.ValidTo.toString() : '', 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IWicBoqCompositeEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.WicBoq?.ValidFrom? info.entity.WicBoq?.ValidFrom.toString() : '', <string>info.value, 'ValidFrom');
	}

}

@Injectable({providedIn: 'root',})
export class WicBoqReadonlyProcessor<T extends IWicBoqCompositeEntity> implements IEntityProcessor<T> {

	private readonly allFields: string[];

	protected dataService: WicBoqDataService | null = null;

	public constructor() {
		// Todo-Boq: Would be nice to have all fields returned by the layoutConfiguration. Currently we use this static list.
		this.allFields = [
			// Attributes coming from BoqRootItem
			'Reference',
			'ExternalCode',
			'BriefInfo',
			// Attributes coming from BoqHeader
			'BasCurrencyFk',
			'IsGCBoq',
			// Attributes coming from WicBoq
			'MdcMaterialCatalogFk',
			'CopyTemplateOnly',
			'BpdBusinessPartnerFk',
			'BpdSubsidiaryFk',
			'BpdSupplierFk',
			'BasPaymentTermFk',
			'BasClerkFk',
			'MdcWicTypeFk',
			'ValidFrom',
			'ValidTo',
			'BasPaymentTermFiFk',
			'BasPaymentTermAdFk',
			'ConHeaderFk',
			'OrdHeaderFk',
			'BpdCustomerFk'
		];
	}

	public process(wicBoqComposite: IWicBoqCompositeEntity): void {
		if (!(wicBoqComposite && wicBoqComposite.BoqRootItem)) {
			return;
		}

		const readOnlyFields = this.getReadOnlyFieldsForItem(wicBoqComposite);

		if (readOnlyFields) {
			this.maintainReadonlyForFields(readOnlyFields, true, wicBoqComposite);
		} else {
			this.maintainReadonlyForFields(this.allFields, false, wicBoqComposite);
		}
	}
	public revertProcess(toProcess: T): void {} // TODO

	protected getReadOnlyFieldsForItem(wicBoqComposite: IWicBoqCompositeEntity) {

		// Check if we have a valid boqCompositeItem
		if (!(wicBoqComposite && wicBoqComposite.BoqRootItem)) {
			return null;
		}

		let readOnlyFields: string[] | null = null;

		if (this.dataService && this.dataService.getReadOnly()) {
			// In this case the underlying data service is set to readonly
			// -> all fields are readonly
			readOnlyFields = this.allFields;
		} else if(this.dataService && this.dataService.isFrameworkWicBoq(wicBoqComposite)) {
			// When having a framework wic boq we only allow changes to the wic type property
			readOnlyFields = this.allFields.filter(fieldName => fieldName !== 'MdcWicTypeFk');
		}

		return readOnlyFields;
	}

	protected maintainReadonlyForFields(fields: string[], isReadonly: boolean, wicBoqComposite: IWicBoqCompositeEntity) {
		//TODO-BOQ: 'wicBoqComposite: IWicBoqCompositeEntity' & 'fieldsMap' will be passed to setEntityReadOnlyFields function.

		fields.map(fieldName => {
			return {field: fieldName, readOnly: isReadonly};
		});

		// TODO-BOQ: There is an issue with using the WicBoqCompositeEntity together with the IReadOnlyField helper class leading to TS compile errors
		// TODO-BOQ: so the next line is simply commented to be compile clean for the moment. A related request for help is placed in the Q&A section.

		// this.dataService.setEntityReadOnlyFields(wicBoqComposite, fieldsMap as IReadOnlyField<WicBoqCompositeEntity>[]);
	}

	public isFieldEditable(wicBoqComposite: IWicBoqCompositeEntity, field: string) {
		let isEditable = false;

		const readOnlyFields = this.getReadOnlyFieldsForItem(wicBoqComposite);

		if (!readOnlyFields || readOnlyFields.indexOf(field) === -1) {
			isEditable = true;
		}

		return isEditable;
	}

	public setDataService(boqWicBoqDataService: WicBoqDataService) {
		this.dataService = boqWicBoqDataService;
	}
}

