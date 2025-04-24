/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY } from '@libs/basics/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedMaterialGroupLookupService, BasicsSharedMaterialLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { PlatformLazyInjectorService, PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';

/**
 * Material record layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialRecordLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly translateService = inject(PlatformTranslateService);
	public async generateLayout(): Promise<object> { //IMaterialEntity
		const commonLayoutService = await this.lazyInjector.inject(BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY);
		const basMaterialLayout = commonLayoutService.generateLayout({
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'MaterialCatalogFk',
						'NeutralMaterialCatalogFk',
						'StockMaterialCatalogFk',
						'Code',
						'MatchCode',
						'DescriptionInfo1',
						'DescriptionInfo2',
						'BasCurrencyFk',
						'RetailPrice',
						'ListPrice',
						'Discount',
						'Charges',
						'Cost',
						'EstimatePrice',
						'CostPriceGross',
						'PriceUnit',
						'BasUomPriceUnitFk',
						'PriceExtra',
						'FactorPriceUnit',
						'SellUnit',
						'MaterialDiscountGroupFk',
						'WeightType',
						'WeightNumber',
						'Weight',
						'MdcTaxCodeFk',
						'UomFk',
						'MaterialGroupFk',
						'PrcPriceconditionFk',
						'AgreementFk',
						'MdcMaterialFk',
						'ExternalCode',
						'MdcMaterialabcFk',
						'LeadTime',
						'MinQuantity',
						'EstCostTypeFk',
						'LeadTimeExtra',
						'SpecificationInfo',
						'FactorHour',
						'IsLive',
						'IsProduct',
						'MdcBrandFk',
						'ModelName',
						'MaterialTempFk',
						'MaterialTempTypeFk',
						'BasUomWeightFk',
						'MaterialTypeFk',
						'DayworkRate',
						'MdcMaterialStockFk',
						'PriceExtraEstPrice',
						'PriceExtraDwRate',
						'EanGtin',
						'Supplier',
						'Co2Source',
						'BasCo2SourceFk',
						'Co2Project',
						'MaterialStatusFk',
					],
				},
				{
					gid: 'dangerousGoods',
					title: {
						key: 'cloud.common.entityDangerousGoods',
						text: 'Dangerous Goods',
					},
					attributes: ['DangerClassFk', 'PackageTypeFk', 'UomVolumeFk', 'Volume'],
				},
				{
					gid: 'userDefinedFields',
					title: {
						key: 'basics.material.record.entityUserDefinedFields',
						text: 'User-Defined Fields',
					},
					attributes: [
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'Userdefined4',
						'Userdefined5',
						'UserDefinedText1',
						'UserDefinedText2',
						'UserDefinedText3',
						'UserDefinedText4',
						'UserDefinedText5',
						'UserDefinedDate1',
						'UserDefinedDate2',
						'UserDefinedDate3',
						'UserDefinedDate4',
						'UserDefinedDate5',
						'UserDefinedNumber1',
						'UserDefinedNumber2',
						'UserDefinedNumber3',
						'UserDefinedNumber4',
						'UserDefinedNumber5',
					],
				},
				// {
				// 	gid: 'ppsUserdefinedTexts',
				// 	title: {
				// 		key: 'productionplanning.ppsmaterial.record.ppsUserdefinedTexts',
				// 		text: '*PPS Userdefined Texts',
				// 	},
				// 	attributes:[],
				// 	// additionalAttributes: [
				// 	// 	'PpsMaterial.UserdefinedForProddesc1',
				// 	// 	'PpsMaterial.UserdefinedForProddesc2',
				// 	// 	'PpsMaterial.UserdefinedForProddesc3',
				// 	// 	'PpsMaterial.UserdefinedForProddesc4',
				// 	// 	'PpsMaterial.UserdefinedForProddesc5',
				// 	// ],
				// },
			],
		});

		const layout = {
			groups: [...(await basMaterialLayout).groups!, {
				gid: 'ppsProperties',
				title: {
					key: 'productionplanning.ppsmaterial.record.ppsProperties',
					text: '*PPS Properties',
				},
				attributes: [],
				additionalAttributes: [
					'PpsMaterial.ProdMatGroupFk',
					'PpsMaterial.IsBundled',
					'PpsMaterial.BasClobsPqtyContent',
					'PpsMaterial.BasUomPlanFk',
					'PpsMaterial.BasClobsBqtyContent',
					'PpsMaterial.BasUomBillFk',
					'PpsMaterial.MatSiteGrpFk',
					'PpsMaterial.IsReadonly',
				],
			}, {
				title: {
					key: 'productionplanning.ppsmaterial.record.puCreationGroup',
					text: '*Planning Unit Creation',
				},
				attributes: [],
				additionalAttributes: [
					'PpsMaterial.QuantityFormula',
					'PpsMaterial.MatGroupOvrFk',
					'PpsMaterial.IsOverrideMaterial',
					'PpsMaterial.MaterialOvrFk',
					'PpsMaterial.BasUomOvrFk',
					'PpsMaterial.IsSerialProduction',
					'PpsMaterial.SummarizeMode',
					'PpsMaterial.SummarizeGroup',
					'PpsMaterial.IsForSettlement',
				],
			}, {
				gid: 'ppsUserdefinedTexts',
				title: {
					key: 'productionplanning.ppsmaterial.record.ppsUserdefinedTexts',
					text: '*PPS Userdefined Texts',
				},
				attributes: [],
				additionalAttributes: [
					'PpsMaterial.UserdefinedForProddesc1',
					'PpsMaterial.UserdefinedForProddesc2',
					'PpsMaterial.UserdefinedForProddesc3',
					'PpsMaterial.UserdefinedForProddesc4',
					'PpsMaterial.UserdefinedForProddesc5',
				],
			}],
			overloads: (await basMaterialLayout).overloads as object[],
			additionalOverloads: {
				// ppsProperties
				'PpsMaterial.ProdMatGroupFk': BasicsSharedCustomizeLookupOverloadProvider.providePpsProductionMaterialGroupLookupOverload(false),
				'PpsMaterial.MatSiteGrpFk': BasicsSharedCustomizeLookupOverloadProvider.providePpsMaterialSiteGroupLookupOverload(true),
				'PpsMaterial.BasUomPlanFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showClearButton: false,
					})
				},
				'PpsMaterial.BasUomBillFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showClearButton: false,
					})
				},

				// puCreationGroup
				'PpsMaterial.MatGroupOvrFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialGroupLookupService,
						displayMember: 'Code',
						showClearButton: true,
					}),
				},
				'PpsMaterial.MaterialOvrFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialLookupService,
						displayMember: 'Code',
						showClearButton: true,
					}),
				},
				'PpsMaterial.BasUomOvrFk': {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showClearButton: true,
					})
				},
				'PpsMaterial.SummarizeMode': {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{ id: 0, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.noSummarized') },
							{ id: 1, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.merge') },
							{ id: 2, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.group') },
							{ id: 3, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.mix') },
						],
					},
				},
				'PpsMaterial.SummarizeGroup': {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{ id: 0, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.noGroups') },
							{ id: 1, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.location1') },
							{ id: 2, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.location2') },
							{ id: 3, displayName: this.translateService.instant('productionplanning.ppsmaterial.summarized.location3') },
						],
					},
				},

			},
			labels: {
				...(await basMaterialLayout).labels!,
				...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
					// ppsProperties
					'PpsMaterial.ProdMatGroupFk': { key: 'mat2ProdMatGroup.entityProdMatGroup', text: '*Production Material Group' },
					'PpsMaterial.IsBundled': { key: 'record.isbundled', text: '*Is Bundled' },
					'PpsMaterial.BasClobsPqtyContent': { key: 'record.basClobsPqtyContent', text: '*Planning Quantity Rule' },
					'PpsMaterial.BasClobsBqtyContent': { key: 'record.basClobsBqtyContent', text: '*Billing Quantity Rule' },
					'PpsMaterial.BasUomPlanFk': { key: 'record.basUomPlanFk', text: '*Planning UoM' },
					'PpsMaterial.BasUomBillFk': { key: 'record.basUomBillFk', text: '*Bill Uom' },
					'PpsMaterial.MatSiteGrpFk': { key: 'record.matSiteGrpFk', text: '*Material Site Group' },
					'PpsMaterial.IsReadonly': { key: 'record.isReadonly', text: '*Readonly as Component' },

					// puCreationGroup
					'PpsMaterial.QuantityFormula': { key: 'record.quantityFormula', text: '*Quantity Formula' },
					'PpsMaterial.IsOverrideMaterial': { key: 'record.isOverrideMaterial', text: '*Override Material' },
					'PpsMaterial.MatGroupOvrFk': { key: 'record.matGroupOvrFk', text: '*Override Material Group' },
					'PpsMaterial.MaterialOvrFk': { key: 'record.materialOvrFk', text: '*New Material' },
					'PpsMaterial.BasUomOvrFk': { key: 'record.basUomOvrFk', text: '*New UoM' },
					'PpsMaterial.IsSerialProduction': { key: 'record.isserialproduction', text: '*Serial Production' },
					'PpsMaterial.IsForSettlement': { key: 'record.isforsettlement', text: '*For Settlement' },
					'PpsMaterial.SummarizeMode': { key: 'summarized.summarizedMode', text: '*Summarized Mode' },
					'PpsMaterial.SummarizeGroup': { key: 'summarized.summarizedGroup', text: '*Summarized Group' },

					// ppsUserdefinedTexts
					'PpsMaterial.UserdefinedForProddesc1': { key: 'record.userdefinedForProddesc1', text: '*Text For Template 1' },
					'PpsMaterial.UserdefinedForProddesc2': { key: 'record.userdefinedForProddesc2', text: '*Text For Template 2' },
					'PpsMaterial.UserdefinedForProddesc3': { key: 'record.userdefinedForProddesc3', text: '*Text For Template 3' },
					'PpsMaterial.UserdefinedForProddesc4': { key: 'record.userdefinedForProddesc4', text: '*Text For Template 4' },
					'PpsMaterial.UserdefinedForProddesc5': { key: 'record.userdefinedForProddesc5', text: '*Text For Template 5' },
				}),

			}
		};

		return layout;
	}
}
