/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningCommonProductProductionSetBehavior } from '../behaviors/productionplanning-common-product-production-set-behavior.service';
import { ProductionplanningCommonProductProductionSetDataService } from '../services/productionplanning-common-product-production-set-data.service';
import { IPpsProductEntity } from '@libs/productionplanning/product';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType,  IAdditionalLookupOptions,  ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { BasicsSharedJobTypeLookupService, BasicsSharedLookupOverloadProvider, BasicsSharedMaterialLookupService, BasicsSharedPpsProductStatusLookupService } from '@libs/basics/shared';
import { IBasicsCustomizePpsProductStatusEntity, IBasicsUomEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { PpsItemLookupService, ProductTemplateSharedSimpleLookupService, ProductionplanningDrawingLookupService } from '@libs/productionplanning/shared';
import { ProjectLocationDataService, ProjectLocationLookupService, ProjectSharedLookupService } from '@libs/project/shared';
import { ProductionSetParentLookupService } from '../services/lookups/productionplanning-productionset-parent-lookup.service';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { ProcurementProjectStockLookupService } from '@libs/procurement/common';
import {PpsProductionPlaceCommonLookupService} from '@libs/productionplanning/productionplace';


export const PRODUCTIONPLANNING_COMMON_PRODUCT_PRODUCTION_SET_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductEntity>({
	grid: {
		title: { key: 'productionplanning.common.product.productionSetProductTitle', text: 'Products' },
		behavior: (ctx) => ctx.injector.get(ProductionplanningCommonProductProductionSetBehavior),
		containerUuid: 'd8c96cdc54a840bfb7651c3228f19887',
	},
	form: {
		title: { key: 'productionplanning.common.product.productionSetProductDetailTitle', text: 'Products Details' },
		containerUuid: '1d2b2bf19d0d44b88539ccu58db79d18',
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningCommonProductProductionSetDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'ProductDto' },
	permissionUuid: 'd8c96cdc54a840bfb7651c3228f19887',
	layoutConfiguration:  (ctx) => {
		const uomLookupOverload = BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true);
		return <ILayoutConfiguration<IPpsProductEntity>>{
			groups: [
				{
					gid: 'product',
					attributes: ['ProductStatusFk', 'Code', 'Descriptioninfo', 'ProductDescriptionFk', 'ProjectId', 'EngDrawingFk', 'MaterialFk', 'LgmJobFk', 'ExternalCode', 'PpsStrandPatternFk', 'IsLive', 'Guid'],
				},
				{
					gid: 'production',
					attributes: [
						'ProductionSetFk',
						'TrsProductBundleFk',
						'PrjLocationFk',
						'PuPrjLocationFk',
						'UnitPrice',
						'BillQuantity',
						'BasUomBillFk',
						'PlanQuantity',
						'BasUomPlanFk',
						'ItemFk',
						'ProductionOrder',
						'Reproduced',
						'PrjStockFk',
						'PrjStockLocationFk',
						'ProductionTime',
						'PpsProcessFk',
						'PpsProductionSetSubFk',
						'FabriCode',
						'FabriExternalCode',
						'ProdPlaceFk',
					],
				},
				{
					gid: 'dimensions',
					attributes: ['Length', 'BasUomLengthFk', 'Width', 'BasUomWidthFk', 'Height', 'BasUomHeightFk', 'Area', 'Area2', 'Area3', 'BasUomAreaFk', 'Volume', 'Volume2', 'Volume3', 'BasUomVolumeFk'],
				},
				{
					gid: 'propertiesGroup',
					attributes: ['IsolationVolume', 'ConcreteVolume', 'ConcreteQuality', 'Weight', 'Weight2', 'Weight3', 'ActualWeight', 'BasUomWeightFk'],
				},
				{
					gid: 'transport',
					attributes: ['TrsRequisitionFk', 'TrsRequisitionDate'],
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'UserdefinedByProddesc1', 'UserdefinedByProddesc2', 'UserdefinedByProddesc3', 'UserdefinedByProddesc4', 'UserdefinedByProddesc5'],
				},
			],
			overloads: {
				ProductStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPpsProductStatusLookupService,
						displayMember: 'DescriptionInfo.Description',
						imageSelector: {
							select(item: IBasicsCustomizePpsProductStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
					readonly: true,
				},
				Code: {
					type: FieldType.Code,
					// TODO: Description as Additional Field
					// additionalFields: [
					// 	{
					// 		id: 'Id',
					// 		displayMember: 'DescriptionInfo.Description',
					// 		label: {
					// 			text: 'Description',
					// 			key: 'cloud.common.entityDescription',
					// 		},
					// 		column: true,
					// 		singleRow: true,
					// 	},
					// ]
				},
				ProductDescriptionFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						displayMember: 'Code',
						dataServiceToken: ProductTemplateSharedSimpleLookupService,
					}),
					additionalFields: [
						{
							id: 'Id',
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Product Template Description',
								key: 'productionplanning.common.product.productDescriptionDesc',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				ProjectId: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						displayMember: 'ProjectNo',
					}),
					readonly: true,
				},
				EngDrawingFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProductionplanningDrawingLookupService,
						displayMember: 'Code',
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								text: '*Drawing Description',
								key: 'productionplanning.common.product.drawingDescription',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				MaterialFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Material-Description',
								key: 'productionplanning.item.materialDescription',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				// TODO: rework (BasicsSiteJobLookupService) added lookup or create a new one - fetches not the expected data
				LgmJobFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedJobTypeLookupService,
						displayMember: 'Code',
					}),
					additionalFields: [
						{
							id: 'Id',
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Job Description',
								key: 'productionplanning.common.product.lgmJobFkDesc',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				PpsStrandPatternFk: {
					readonly: true,
				},
				IsLive: {
					readonly: true,
				},
				ProductionSetFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProductionSetParentLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Description',
							label: {
								text: '*Production Set Description',
								key: 'productionplanning.common.product.productionSetDes',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				// TODO: lookup has to be created url: getitembykey?lookup=trsbundlelookup&Id=70
				// TrsProductBundleFk: {
				// 	type: FieldType.Lookup,
				// 	lookupOptions: createLookup({
				// 		dataServiceToken: BasicsSharedTransportBundleStatusLookupService
				// 	}),
				// 	readonly: true,
				// },
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						displayMember: 'Code',
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IPpsProductEntity>) {
								return {
									ProjectId: context.injector.get(ProjectLocationDataService).getSelectedEntity()?.Id
								};
							}
						}
					}),
					additionalFields: [
						{
							id: 'LinkProductIcon',
							displayMember: 'LinkProductIcon',
							label: {
								text: '*Annotation Status',
								key: 'productionplanning.common.product.annotationStatus',
							},
							column: true,
							singleRow: true,
						},
						{
							id: 'branchpath',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: '*Location Full Description',
								key: 'productionplanning.common.branchPath',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				ProductionOrder: {
					readonly: true,
				},
				UnitPrice: {
					type: FieldType.Decimal,
					readonly: true,
				},
				BillQuantity:{
					type: FieldType.Integer,
					readonly: true,
				},
				BasUomBillFk: {
					type: FieldType.Lookup,
					lookupOptions: (uomLookupOverload as IAdditionalLookupOptions<IBasicsUomEntity>).lookupOptions,
					additionalFields: [
						{
							id: 'DescriptionInfo.Translated',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: '*Bill UoM-Description',
								key: 'productionplanning.common.product.billUoMDescription',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				PlanQuantity: {
					type: FieldType.Decimal
				},
				BasUomPlanFk: {
					type: FieldType.Lookup,
					lookupOptions: (uomLookupOverload as IAdditionalLookupOptions<IBasicsUomEntity>).lookupOptions,
					additionalFields: [
						{
							id: 'DescriptionInfo.Translated',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: '*Plan UoM-Description',
								key: 'productionplanning.common.product.planUoMDescription',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				// TOdO: extract from Main Request from Product Container??
				// TrsRequisitionFk: {
				// 	valueAccessor: {
				// 		getValue(obj: IPpsProductEntity): object | string {
				// 			// const dsModes = ctx.injector.get(DATESHIFT_MODES_TOKEN);
				// 			return obj;
				// 		},
				// 	},
				// 	readonly: true,
				// },
				ItemFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsItemLookupService,
					}),
					additionalFields: [
						{
							id: 'DescriptionInfo.Translated',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: '*Production Unit Description',
								key: 'productionplanning.common.event.itemDesc',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				PpsProcessFk: {
					// TODO: PpsProcessFk has to be implemted - zwz team china
					readonly: true,
				},
				ProdPlaceFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsProductionPlaceCommonLookupService,
						displayMember: 'Code'
					}),
					readonly: true,
				},
				PuPrjLocationFk: {
					readonly: true,
				},
				PrjStockFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsProductEntity, IProjectStockLookupEntity>({
						 dataServiceToken: ProcurementProjectStockLookupService,
					}),
					additionalFields: [
						 {
							  displayMember: 'Description',
							  label: {
									key: 'productionplanning.common.product.projectStockDesc',
									text: '*Stock Description'
							  },
							  column: true,
							  singleRow: true,
						 },
					],
					readonly: true,
			  },
				// TODO: lookup (shen) isn't working due to typos, also not able to set pKeys from
				//  within serverSideFilter !?
				// PrjStockLocationFk: {
				// 		type: FieldType.Lookup,
				// 	lookupOptions: createLookup({
				// 		dataServiceToken: ProjectStockLocationLookupService,
				// 		displayMember: 'Code',
				// 		serverSideFilter: {
				// 			key: '',
				// 			execute(context: ILookupContext<IProjectStockLocationEntity, IPpsProductEntity>)  {
				// 					// return { PKey1: context.lookupConfig.idProperty ? context.entity.PrjStockFk : null};
				// 					return { PKey1: context.lookupConfig.idProperty};

				// 			},
				// 		},

				// 		readonly: true,
				// 	}),
				// },
				// PrjStockLocationFk: {
				// 	readonly: true
				// },
				PpsProductionSetSubFk: {
					// TODO: additional columns [Sub Production Set Date, Sub Production Set Supplier]
					readonly: true,
				},
				FabriCode: {
					readonly: true
				},
				FabriExternalCode: {
					readonly: true
				},
				Width: {
					type: FieldType.Decimal
				},
				Height: {
					type: FieldType.Decimal
				},
				// TODO: Additional Fields (Description) -> no readonly set
				BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomAreaFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomVolumeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				BasUomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				// BasUomLengthFk: {
				// 	type: FieldType.Lookup,
				// 	lookupOptions: (uomLookupOverload as IAdditionalLookupOptions<IBasicsUomEntity>).lookupOptions,



				// 	additionalFields: [
				// 		{
				// 			id: 'DescriptionInfo.Translated',
				// 			displayMember: 'DescriptionInfo.Translated',
				// 			label: {
				// 				text: '*Length UoM Description',
				// 				key: 'productionplanning.common.product.lengthUoMDesc',
				// 			},
				// 			column: true,
				// 			singleRow: true,
				// 		},
				// 	],
				// 	readonly: true,
				// },
				// BasUomWidthFk: {
				// 	type: FieldType.Lookup,
				// 	lookupOptions: (uomLookupOverload as IAdditionalLookupOptions<IBasicsUomEntity>).lookupOptions,
				// 	additionalFields: [
				// 		{
				// 			id: 'DescriptionInfo.Translated',
				// 			displayMember: 'DescriptionInfo.Translated',
				// 			label: {
				// 				text: '*Width UoM Description',
				// 				key: 'productionplanning.common.product.widthUoMDesc',
				// 			},
				// 			column: true,
				// 			singleRow: true,
				// 		},
				// 	],
				// 	readonly: true,
				// },

				Userdefined1: {
					label: {
						text: '*User-Defined 1',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '1' },
					},
					type: FieldType.Description,
				},
				Userdefined2: {
					label: {
						text: '*User-Defined 2',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '2' },
					},
					type: FieldType.Description,
				},
				Userdefined3: {
					label: {
						text: '*User-Defined 3',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '3' },
					},
					type: FieldType.Description,
				},
				Userdefined4: {
					label: {
						text: '*User-Defined 4',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '4' },
					},
					type: FieldType.Description,
				},
				Userdefined5: {
					label: {
						text: '*User-Defined 5',
						key: 'cloud.common.entityUserDefined',
						params: { p_0: '5' },
					},
					type: FieldType.Description,
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: '*Code' },
					Descriptioninfo: { key: 'entityDescription', text: '*Description' },
					IsLive: { key: 'entityIsLive', text: '*Active' },
					ProductStatusFk: { key: 'entityStatus', text: '*Status' },
					ProjectId: { key: 'entityProjectNo', text: '*Project No' },
				}),
				...prefixAllTranslationKeys('productionplanning.item.', {
					materialDescription: { text: '*Material-Description', key: 'productionplanning.item.materialDescription' },
				}),
				...prefixAllTranslationKeys('productionplanning.fabricationunit.', {
					PpsStrandPatternFk: { text: '*Strand Pattern', key: 'entityPpsStrandPatternFk' },
				}),
				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					ProdPlaceFk: { text: '*Production Place', key: 'phase.PpsProdPlaceFk' },
				}),
				...prefixAllTranslationKeys('procurement.', {
					PrjStockLocationFk: { key: 'inventory.prjstocklocationfk', text: '*Storage Location', },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					ProductionSetFk: { key: 'product.productionSetFk', text: '*Production Set' },
					FabriCode: { key: 'product.FabriCode', text: '*Fabrication Unit Code' },
					FabriExternalCode: { key: 'product.FabriExternalCode', text: '*Fabrication Unit ExternalCode' },
					ExternalCode: { key: 'product.externalCode', text: '*ExternalCode' },
					MaterialFk: { key: 'mdcMaterialFk', text: '*Material' },
					EngDrawingFk: { key: 'product.drawing', text: '*Drawing' },
					LgmJobFk: { key: 'product.lgmJobFk', text: '*Job' },
					Length: { key: 'product.length', text: '*Length' },
					Width: { key: 'product.width', text: '*Width' },
					Height: { key: 'product.height', text: '*Height' },
					BasUomLengthFk: { key: 'product.lengthUoM', text: '*Length UoM' },
					BasUomWidthFk: { key: 'product.widthUoM', text: '*Width UoM' },
					BasUomHeightFk: { key: 'product.heightUoM', text: '*Height UoM' },
					BasUomAreaFk: { key: 'product.areaUoM', text: '*Area UoM' },
					BasUomVolumeFk: { key: 'product.volumeUoM', text: '*Volume UoM' },
					Area: { key: 'additionalColumns.areaCustomUom', text: '*Area' },
					Area2: { key: 'additionalColumns.area2CustomUom', text: '*Area2' },
					Area3: { key: 'additionalColumns.area3CustomUom', text: '*Area3' },
					Volume: { key: 'product.volume', text: '*Volume' },
					Volume2: { key: 'product.volume2', text: '*Volume2' },
					Volume3: { key: 'product.volume3', text: '*Volume3' },
					PlanQuantity: { key: 'product.planQuantity', text: '*Plan Quantity' },
					BasUomPlanFk: { key: 'product.planUoM', text: '*Plan UoM' },
					BillQuantity: { key: 'product.billQuantity', text: '*Bill Quantity' },
					BasUomBillFk: { key: 'product.billUoM', text: '*Bill UoM' },
					ProductionOrder: { key: 'product.productionOrder', text: '*Production Order' },
					ProductDescriptionFk: { key: 'product.productDescriptionFk', text: '*Product Template' },
					Reproduced: { key: 'product.reproduced', text: '*Reproduced' },
					PrjStockFk:{ key: 'product.projectStock', text: '*Stock' },
					PpsProductionSetSubFk:{ key: 'product.subProductionSet', text: '*Sub Production Set' },
					PpsProcessFk:{ key: 'product.Process', text: '*Process' },
					ItemFk: { key: 'event.itemFk', text: '*Production Unit' },
					ProductionTime: { key: 'productionTime', text: '*Production Finished' },
					PrjLocationFk: { key: 'prjLocationFk', text: '*Location' },
					PuPrjLocationFk: { key: 'puPrjLocationFk', text: '*Location PU' },
					Guid: { key: 'product.GUID', text: '*GUID' },
					UnitPrice: { key: 'product.unitPrice', text: '*Unit Price' },
					TrsProductBundleFk: { key: 'product.trsProductBundleFk', text: '*Bundle' },
					Weight: { key: 'additionalColumns.weightCustomUom', text: '*Weight [Custom Uom]' },
					Weight2: { key: 'additionalColumns.weight2CustomUom', text: '*Weight2 [Custom Uom]' },
					Weight3: { key: 'additionalColumns.weight3CustomUom', text: '*Weight3 [Custom Uom]' },
					ActualWeight: { key: 'product.actualWeight', text: '*Actual Weight' },
					BasUomWeightFk: { key: 'product.actualWeight', text: '*Actual Weight' },

				}),
			},
		};
	},
});
