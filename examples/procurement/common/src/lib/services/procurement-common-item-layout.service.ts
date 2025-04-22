/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { CompleteIdentification, IEntityIdentification, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';

import { IPrcItemEntity } from '../model/entities';
import { BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule, BasicsSharedLookupOverloadProvider, BasicsSharedLookupLayoutProvider, MATERIAL_FILTER_OPTIONS } from '@libs/basics/shared';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { ProcurementCommonItemLookupService } from '../lookups/procurement-common-item-lookup.service';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { ProcurementCommonItemDataService } from '../services/procurement-common-item-data.service';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN } from '@libs/controlling/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { IBasicsUomEntity } from '@libs/basics/interfaces';

/**
 * Procurement common item entity layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonItemLayoutService {
	private readonly injector = inject(Injector);
	private readonly basicsSharedLookupLayoutProvider = inject(BasicsSharedLookupLayoutProvider);
	private readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);

	/**
	 * Generate layout config
	 */
	public async generateLayout<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		context: IInitializationContext,
		config: {
			dataServiceToken: ProviderToken<ProcurementCommonItemDataService<T, U, PT, PU>>;
		},
	): Promise<ILayoutConfiguration<T>> {
		const dataService = this.injector.get(config.dataServiceToken);
		const headerService = dataService.parentService;
		const controllingUnitLookupProvider = await context.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);
		const bpRelatedLookupProvider = await context.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const resourceEquipmentLookupProvider = await context.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);

		return runInInjectionContext(this.injector, () => {
			const layout = <ILayoutConfiguration<T>>{
				groups: [
					{
						gid: 'basicData',
						title: {
							key: 'cloud.common.entityProperties',
							text: 'Basic Data',
						},
						attributes: [
							'QuantityConverted',
							'TotalLeadTime',
							'QuantityRemaining',
							'Itemno',
							'PrcPackageFk',
							'PrcStructureFk',
							'MdcMaterialFk',
							'Description1',
							'Description2',
							'Specification',
							'Quantity',
							'BasUomFk',
							'FactorPriceUnit',
							'PrcItemstatusFk',
							'SafetyLeadTime',
							'BufferLeadTime',
							'LeadTimeExtra',
							'QuantityConfirm',
							'DeliverDateConfirm',
							'BasItemTypeFk',
							'BasItemType2Fk',
							'PrcItemAltFk',
							'IsFreeQuantity',
							'Discount',
							'DiscountComment',
							'BasItemType85Fk',
							'SellUnit',
							'LeadTime',
							'MinQuantity',
							'HasScope',
							'ExternalCode',
							'CommentContractor',
							'CommentClient',
							'PrjStockFk',
							'PrjStockLocationFk',
							'ControllinggrpsetFk',
							'PlantFk',
							'DiscountSplit',
							'DiscountSplitOc',
							'MaterialExternalCode',
							'AlternativeUomFk',
							'AlternativeQuantity',
							'ResRequisitionFk',
							'MdcSalesTaxGroupFk',
							// TODO - 'JobFk',
							'AAN',
							'AGN',
							'MaterialStockFk',
							'IsDisabled',
							'NotSubmitted',
							'Co2Project',
							'Co2ProjectTotal',
							'Co2SourceTotal',
							'Co2Source',
							'DiscountAbsolute',
							'DiscountAbsoluteOc',
							'DiscountAbsoluteGross',
							'DiscountAbsoluteGrossOc',
							'ContractGrandQuantity',
							'TotalCallOffQuantity',
							'RemainingQuantityForCallOff',
						],
					},
					{
						gid: 'pricing',
						title: {
							key: 'procurement.common.pricing',
							text: 'Pricing',
						},
						attributes: [
							'TotalNoDiscount',
							'TotalCurrencyNoDiscount',
							'Price',
							'PriceOc',
							'PrcPriceConditionFk',
							'PriceExtra',
							'PriceExtraOc',
							'PriceUnit',
							'BasUomPriceUnitFk',
							'TargetPrice',
							'TargetTotal',
							'PriceGross',
							'PriceGrossOc',
							'Total',
							'TotalOc',
							'TotalGross',
							'TotalGrossOc',
							'TotalPrice',
							'TotalPriceOc',
							'TotalPriceGross',
							'TotalPriceGrossOc',
							'BudgetPerUnit',
							'BudgetTotal',
							'BudgetFixedUnit',
							'BudgetFixedTotal',
						],
					},
					{
						gid: 'projectChange',
						title: {
							key: 'procurement.common.projectChange',
							text: 'Project Change',
						},
						attributes: ['PrjChangeFk', 'PrjChangeStatusFk'],
					},
					{
						gid: 'plantHire',
						title: {
							key: 'procurement.common.plantHire',
							text: 'Plant Hire',
						},
						attributes: ['Hasdeliveryschedule', 'Onhire', 'DateRequired', 'Offhire'],
					},
					{
						gid: 'settings',
						title: {
							key: 'procurement.common.settings',
							text: 'Settings',
						},
						attributes: ['Address', 'MdcControllingunitFk', 'MdcTaxCodeFk', 'BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'PrcIncotermFk', 'Hastext', 'Supplierreference', 'Batchno', 'BpdAgreementFk'],
					},
					{
						gid: 'others',
						title: {
							key: 'procurement.common.others',
							text: 'Others',
						},
						attributes: ['QuantityAskedfor', 'QuantityDelivered'],
					},
					{
						gid: 'user',
						title: {
							key: 'procurement.common.user',
							text: 'User',
						},
						attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
					},
				],
				labels: {
					...prefixAllTranslationKeys('procurement.common.', {
						TotalNoDiscount: {
							key: 'prcItemTotalNoDiscount',
							text: 'Total (No Discount)',
						},
						Address: {
							key: 'prcItemDeliveryAddress',
							text: 'Delivery Address',
						},
						TotalCurrencyNoDiscount: {
							key: 'prcItemTotalCurrencyNoDiscount',
							text: 'Total (No Discount) (OC)',
						},
						QuantityConverted: {
							key: 'prcItemFactoredQuantity',
							text: 'Factored Quantity',
						},
						TotalLeadTime: {
							key: 'totalLeadTime',
							text: 'Total Lead Time',
						},
						QuantityRemaining: {
							key: 'prcItemRemainingQuantity',
							text: 'Remaining Quantity',
						},
						Itemno: {
							key: 'prcItemItemNo',
							text: 'Item No.',
						},
						PrcPackageFk: {
							key: 'prcItemPackage',
							text: 'Package',
						},
						MdcMaterialFk: {
							key: 'prcItemMaterialNo',
							text: 'Material No.',
						},
						Description1: {
							key: 'prcItemDescription1',
							text: 'Description 1',
						},
						Description2: {
							key: 'prcItemFurtherDescription',
							text: 'Further Description',
						},
						BasUomFk: {
							key: 'accountAssign.BasUom',
							text: 'Uom',
						},
						PriceOc: {
							key: 'prcItemPriceCurrency',
							text: 'Price Currency',
						},
						PriceExtraOc: {
							key: 'prcItemPriceExtrasCurrency',
							text: 'Price Extras (Currency)',
						},
						TargetPrice: {
							key: 'prcItemTargetPrice',
							text: 'Target Price',
						},
						TargetTotal: {
							key: 'prcItemTargetTotal',
							text: 'Target Total',
						},
						Hasdeliveryschedule: {
							key: 'prcItemHasDeliverySchedule',
							text: 'Has Delivery Schedule',
						},
						Onhire: {
							key: 'prcItemOnHireDate',
							text: 'On Hire Date',
						},
						Offhire: {
							key: 'prcItemOffHireDate',
							text: 'Off Hire Date',
						},
						Hastext: {
							key: 'prcItemHasText',
							text: 'Has Text',
						},
						Supplierreference: {
							key: 'prcItemSupplierReference',
							text: 'Supplier Reference',
						},
						QuantityAskedfor: {
							key: 'prcItemQuantityAskedfor',
							text: 'Quantity Asked for',
						},
						QuantityDelivered: {
							key: 'prcItemQuantityDelivered',
							text: 'Quantity Delivered',
						},
						Batchno: {
							key: 'prcItemBatchno',
							text: 'Batchno',
						},
						BpdAgreementFk: {
							key: 'bpdAgreement',
							text: 'Agreement',
						},
						SafetyLeadTime: {
							key: 'safetyLeadTime',
							text: 'Safety Lead Time',
						},
						BufferLeadTime: {
							key: 'bufferLeadTime',
							text: 'Buffer Lead Time',
						},
						LeadTimeExtra: {
							key: 'leadTimeExtra',
							text: 'Express Lead Time',
						},
						QuantityConfirm: {
							key: 'quantityConfirm',
							text: 'Quantity Confirm',
						},
						DeliverDateConfirm: {
							key: 'deliverDateConfirm',
							text: 'Deliver Date Confirm',
						},
						BasItemTypeFk: {
							key: 'prcItemType',
							text: 'Item Type',
						},
						BasItemType2Fk: {
							key: 'prcItemType2',
							text: 'Item Type2',
						},
						PrcItemAltFk: {
							key: 'prcItemAlt',
							text: 'Item Alt',
						},
						IsFreeQuantity: {
							key: 'isFreeQuantity',
							text: 'Is Free Quantity',
						},
						Discount: {
							key: 'Discount',
							text: 'Discount Percent',
						},
						DiscountComment: {
							key: 'DiscountComment',
							text: 'Discount Comment',
						},
						BasItemType85Fk: {
							key: 'alternativeBid',
							text: 'Alternative Bid',
						},
						SellUnit: {
							key: 'prcItemSellUnit',
							text: 'Sell Unit',
						},
						LeadTime: {
							key: 'entityLeadTime',
							text: 'Supplier Lead Time',
						},
						MinQuantity: {
							key: 'prcItemMinQuantity',
							text: 'Min Quantity',
						},
						HasScope: {
							key: 'entityHasScope',
							text: 'Has Scope',
						},
						ExternalCode: {
							key: 'externalCode',
							text: 'External Code',
						},
						CommentContractor: {
							key: 'CommentContractor',
							text: 'Comment Contractor',
						},
						CommentClient: {
							key: 'CommentClient',
							text: 'Comment Client',
						},
						PrjStockFk: {
							key: 'entityPrjStock',
							text: 'Stock',
						},
						PrjStockLocationFk: {
							key: 'entityPrjStockLocation',
							text: 'Stock Location',
						},
						PlantFk: {
							key: 'entityPlant',
							text: 'Plant',
						},
						DiscountSplit: {
							key: 'DiscountSplitEntity',
							text: 'Discount Split',
						},
						DiscountSplitOc: {
							key: 'DiscountSplitOcEntity',
							text: 'Discount Split Oc',
						},
						PriceGross: {
							key: 'priceGross',
							text: 'Price Gross',
						},
						PriceGrossOc: {
							key: 'priceOcGross',
							text: 'Price Gross(OC)',
						},
						TotalOc: {
							key: 'prcItemTotalCurrency',
							text: 'Total (Currency)',
						},
						TotalGross: {
							key: 'totalGross',
							text: 'Total (Gross)',
						},
						TotalGrossOc: {
							key: 'totalOcGross',
							text: 'Total (Gross OC)',
						},
						TotalPrice: {
							key: 'prcItemTotalPrice',
							text: 'Total Price',
						},
						TotalPriceOc: {
							key: 'prcItemTotalPriceCurrency',
							text: 'Total Price (Currency)',
						},
						MaterialExternalCode: {
							key: 'prcItemMaterialExternalCode',
							text: 'Material External Code',
						},
						TotalPriceGross: {
							key: 'totalPriceGross',
							text: 'Total Price Gross',
						},
						TotalPriceGrossOc: {
							key: 'totalPriceGrossOc',
							text: 'Total Price Gross(OC)',
						},
						AlternativeUomFk: {
							key: 'AlternativeUom',
							text: 'Alternative Uom',
						},
						AlternativeQuantity: {
							key: 'AlternativeQuantity',
							text: 'Alternative Quantity',
						},
						ResRequisitionFk: {
							key: 'entityResRequisition',
							text: 'Resource Requisition',
						},
						BudgetPerUnit: {
							key: 'entityBudgetPerUnit',
							text: 'Budget Per Unit',
						},
						BudgetTotal: {
							key: 'entityBudgetTotal',
							text: 'Budget Total',
						},
						BudgetFixedUnit: {
							key: 'entityBudgetFixedUnit',
							text: 'Budget Fixed Unit',
						},
						BudgetFixedTotal: {
							key: 'entityBudgetFixedTotal',
							text: 'Budget Fixed Total',
						},
						JobFk: {
							key: 'entityJob',
							text: 'Job',
						},
						AAN: {
							key: 'AAN',
							text: 'AAN',
						},
						AGN: {
							key: 'AGN',
							text: 'AGN',
						},
						MaterialStockFk: {
							key: 'prcItemMaterialStockFk',
							text: 'Stock Material',
						},
						IsDisabled: {
							key: 'entityIsDisabled',
							text: 'Is Disabled',
						},
						Co2Project: {
							key: 'entityCo2Project',
							text: 'CO2/kg (Project)',
						},
						Co2ProjectTotal: {
							key: 'entityCo2ProjectTotal',
							text: 'CO2/kg (Project Total)',
						},
						Co2SourceTotal: {
							key: 'entityCo2SourceTotal',
							text: 'CO2/kg (Source Total)',
						},
						Co2Source: {
							key: 'entityCo2Source',
							text: 'CO2/kg (Source)',
						},
						DiscountAbsolute: {
							key: 'DiscountAbsolute',
							text: 'Discount Absolute',
						},
						DiscountAbsoluteOc: {
							key: 'DiscountAbsoluteOc',
							text: 'Discount Absolute (OC)',
						},
						DiscountAbsoluteGross: {
							key: 'DiscountAbsoluteGross',
							text: 'Discount Absolute Gross',
						},
						DiscountAbsoluteGrossOc: {
							key: 'DiscountAbsoluteGrossOc',
							text: 'Discount Absolute Gross (OC)',
						},
						PrjChangeFk: {
							key: 'projectChange',
							text: 'Project Change',
						},
						PrjChangeStatusFk: {
							key: 'projectChangeStatus',
							text: 'Project Change Status',
						},
						ContractGrandQuantity: {
							key: 'prcItemContractGrandQuantity',
							text: 'Contract Grand Quantity',
						},
						TotalCallOffQuantity: {
							key: 'prcItemTotalCallOffQuantity',
							text: 'Total CallOff Quantity',
						},
						RemainingQuantityForCallOff: {
							key: 'remainingQuantityForCallOff',
							text: 'Remaining Quantity For CallOff',
						},
						MdcSalesTaxGroupFk: {
							key: 'entityMdcSalesTaxGroupFk',
							text: 'Sales Tax Group',
						},
						NotSubmitted: {
							key: 'item.notSubmitted',
							text: 'Not Submitted',
						},
					}),
					...prefixAllTranslationKeys('basics.material.', {
						PrcStructureFk: {
							key: 'materialSearchLookup.htmlTranslate.structure',
							text: 'Structure',
						},
						PriceExtra: {
							key: 'record.priceExtras',
							text: 'Extras',
						},
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						Specification: {
							key: 'EntitySpec',
							text: 'Specification',
						},
						Quantity: {
							key: 'entityQuantity',
							text: 'Quantity',
						},
						Price: {
							key: 'entityPrice',
							text: 'Price',
						},
						PrcPriceConditionFk: {
							key: 'entityPriceCondition',
							text: 'Price Condition',
						},
						PriceUnit: {
							key: 'entityPriceUnit',
							text: 'Price Unit',
						},
						BasUomPriceUnitFk: {
							key: 'entityPriceUnitUoM',
							text: 'Price Unit UoM',
						},
						FactorPriceUnit: {
							key: 'entityFactor',
							text: 'Factor',
						},
						MdcControllingunitFk: {
							key: 'entityControllingUnitCode',
							text: 'Controlling Unit Code',
						},
						DateRequired: {
							key: 'entityRequiredBy',
							text: 'Required By',
						},
						MdcTaxCodeFk: {
							key: 'entityTaxCode',
							text: 'Tax Code',
						},
						BasPaymentTermFiFk: {
							key: 'entityPaymentTermFI',
							text: 'Payment Term (FI)',
						},
						BasPaymentTermPaFk: {
							key: 'entityPaymentTermPA',
							text: 'Payment Term (PA)',
						},
						PrcIncotermFk: {
							key: 'entityIncoterms',
							text: 'Incoterms',
						},
						Userdefined1: {
							key: 'entityUserDefined',
							text: 'User-Defined 1',
							params: { p_0: '1' },
						},
						Userdefined2: {
							key: 'entityUserDefined',
							text: 'User-Defined 2',
							params: { p_0: '2' },
						},
						Userdefined3: {
							key: 'entityUserDefined',
							text: 'User-Defined 3',
							params: { p_0: '3' },
						},
						Userdefined4: {
							key: 'entityUserDefined',
							text: 'User-Defined 4',
							params: { p_0: '4' },
						},
						Userdefined5: {
							key: 'entityUserDefined',
							text: 'User-Defined 5',
							params: { p_0: '5' },
						},
						PrcItemstatusFk: {
							key: 'entityState',
							text: 'Status',
						},
						ControllinggrpsetFk: {
							key: 'entityControllinggrpset',
							text: 'Controlling Group Set',
						},
						Total: {
							key: 'entityTotal',
							text: 'Total',
						},
					}),
				},
				overloads: {
					TotalNoDiscount: {
						readonly: true,
					},
					TotalCurrencyNoDiscount: {
						readonly: true,
					},
					QuantityConverted: {
						readonly: true,
					},
					TotalLeadTime: {
						readonly: true,
					},
					QuantityRemaining: {
						readonly: true,
					},
					PriceExtra: {
						readonly: true,
					},
					PriceExtraOc: {
						readonly: true,
					},
					Hasdeliveryschedule: {
						readonly: true,
					},
					Hastext: {
						readonly: true,
					},
					QuantityAskedfor: {
						readonly: true,
					},
					QuantityDelivered: {
						readonly: true,
					},
					Batchno: {
						readonly: true,
					},
					HasScope: {
						readonly: true,
					},
					ControllinggrpsetFk: {
						readonly: true,
					},
					DiscountSplit: {
						readonly: true,
					},
					DiscountSplitOc: {
						readonly: true,
					},
					Total: {
						readonly: true,
					},
					TotalOc: {
						readonly: true,
					},
					TotalPrice: {
						readonly: true,
					},
					TotalPriceOc: {
						readonly: true,
					},
					TotalPriceGross: {
						readonly: true,
					},
					TotalPriceGrossOc: {
						readonly: true,
					},
					MaterialStockFk: BasicsSharedLookupOverloadProvider.provideMaterialReadonlyLookupOverload(),
					IsDisabled: {
						readonly: true,
					},
					Co2ProjectTotal: {
						readonly: true,
					},
					Co2SourceTotal: {
						readonly: true,
					},
					Co2Source: {
						readonly: true,
					},
					ContractGrandQuantity: {
						readonly: true,
					},
					TotalCallOffQuantity: {
						readonly: true,
					},
					RemainingQuantityForCallOff: {
						readonly: true,
					},
					PrcItemstatusFk: BasicsSharedLookupOverloadProvider.provideProcurementItemStatusReadonlyLookupOverload(),
					MdcMaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true, undefined, {
						providers: [
							{
								provide: MATERIAL_FILTER_OPTIONS,
								useValue: { isEnableMultiSelect: true },
							},
						],
					}),
					MdcTaxCodeFk: ProcurementSharedLookupOverloadProvider.provideTaxCodeLookupOverload(true),
					Price: {
						// TODO-lvy - mandatory, procument-pes-item-highlight-cell-input, highlightColumn
					},
					PriceOc: {
						// TODO-lvy - mandatory, procument-pes-item-highlight-cell-input, highlightColumn
					},
					PriceGross: {
						// TODO-lvy - mandatory, procument-pes-item-highlight-cell-input, highlightColumn
					},
					PriceGrossOc: {
						// TODO-lvy - mandatory, procument-pes-item-highlight-cell-input, highlightColumn
					},
					Itemno: {
						// TODO - basics-common-limit-input
					},
					PrcPackageFk: ProcurementSharedLookupOverloadProvider.providePackageReadonlyLookupOverload(),
					PrcStructureFk: BasicsSharedLookupOverloadProvider.provideProcurementStructureLookupOverload(true),
					MdcSalesTaxGroupFk: BasicsSharedLookupOverloadProvider.provideAdditionalSalesTaxGroupLookupOverload(true),
					BasItemTypeFk: BasicsSharedLookupOverloadProvider.provideItemTypeLookupOverload(false),
					BasItemType2Fk: BasicsSharedLookupOverloadProvider.provideItemType2LookupOverload(false),
					PrcItemAltFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataService: new ProcurementCommonItemLookupService(dataService),
							showClearButton: true,
							showDescription: true,
							descriptionMember: 'Description1',
						}),
					},
					BasItemType85Fk: BasicsSharedLookupOverloadProvider.provideItemType85LookupOverload(false),
					BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
					AlternativeUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true, {
						execute(item: IBasicsUomEntity, context: ILookupContext<IBasicsUomEntity, T>): boolean {
							const entity = context.entity;

							if (!entity?.Material2Uoms) {
								return true;
							}

							return entity.Material2Uoms.some((e) => e.UomFk === item.Id);
						},
					}),
					JobFk: {
						// TODO - waiting for https://rib-40.atlassian.net/browse/DEV-39107
					},
					PlantFk: resourceEquipmentLookupProvider.providePlantLookupOverload({ showClearButton: true }),
					PrcPriceConditionFk: BasicsSharedLookupOverloadProvider.providePriceConditionLookupOverload(true),
					BasUomPriceUnitFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
					MdcControllingunitFk: controllingUnitLookupProvider.generateControllingUnitLookup<T>(context, {
						checkIsAccountingElement: true,
						controllingUnitGetter: (e) => e.MdcControllingunitFk,
						lookupOptions: {
							serverSideFilter: {
								key: 'prc.con.controllingunit.by.prj.filterkey',
								execute: (context) => {
									const header = headerService.getHeaderContext();
									return {
										PrjProjectFk: header.projectFk,
										ExtraFilter: true,
										ByStructure: true,
									};
								},
							},
						},
					}),
					BasPaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermFiDescription'),
					BasPaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
					PrcIncotermFk: BasicsSharedLookupOverloadProvider.provideIncoTermLookupOverload(true),
					Address: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
					BpdAgreementFk: bpRelatedLookupProvider.getBusinessPartnerAgreementLookupOverload({
						showClearButton: true,
						customServerSideFilter: {
							key: 'procurement-common-item-agreement-filter',
							execute: () => {
								return dataService.getAgreementLookupFilter();
							},
						},
					}),
					PrjStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload({
						showClearButton: true,
						readonly: false,
						serverSideFilter: {
							key: 'procurement-common-item-stock-type-filter',
							execute: (context) => {
								const stockContext = dataService.getStockContext();
								const headerContext = headerService.getHeaderContext();

								return {
									PKey2: stockContext.materialStockFk || stockContext.materialFk,
									PKey3: headerContext.projectFk,
								};
							},
						},
					}),
					PrjStockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationOptionLookupOverload({
						showClearButton: true,
					}),
					CommentContractor: {
						type: FieldType.Remark,
					},
					CommentClient: {
						type: FieldType.Remark,
					},
					ResRequisitionFk: {
						// TODO - navigator
						// TODO - waiting for https://rib-40.atlassian.net/browse/DEV-39105
					},
					NotSubmitted: {
						type: FieldType.Boolean,
					},
					PrjChangeFk: ProcurementSharedLookupOverloadProvider.providePrjChangeFkLookupOverload(true, {
						key: 'procurement-project-change-common-filter',
						execute: () => {
							const header = headerService.getHeaderContext();
							return {
								ProjectFk: header.projectFk,
							};
						},
					}),
					PrjChangeStatusFk: BasicsSharedLookupOverloadProvider.provideProjectChangeStatusReadonlyLookupOverload(),
				},
			};
			this.roundingService.uiRoundingConfig(layout);

			this.basicsSharedLookupLayoutProvider.provideMaterialLookupFields<T>(layout, {
				gid: 'basicData',
				lookupKeyGetter: (e) => e.MdcMaterialFk,
				dataService: dataService,
			});

			return layout;
		});
	}
}
