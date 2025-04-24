/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { PpsProductDataService } from '../services/pps-product-data.service';
import { IPpsProductEntity } from './entities/product-entity.interface';
import { PpsProductFormBehavior, PpsProductGridBehavior } from '../behaviors/pps-product-behavior.service';
import { PpsProcessCommonLookupService } from '@libs/productionplanning/shared';

export const PRODUCTIONPLANNING_PRODUCT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductEntity>({
	grid: {
		title: { key: 'productionplanning.product.listTitle' },
		behavior: (ctx) => ctx.injector.get(PpsProductGridBehavior),
		containerUuid: '434794d7bfbb4c9c8aeb4df85eb602d0',
	},
	form: {
		title: { key: 'productionplanning.product.detailTitle' },
		behavior: (ctx) => ctx.injector.get(PpsProductFormBehavior),
		containerUuid: 'cf6ed0df37b34b68a5190b375eabe91f',
	},
	dataService: (ctx) => ctx.injector.get(PpsProductDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'ProductDto' },
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'product',
				attributes: ['Code', 'Descriptioninfo', 'ProductStatusFk', 'ProductDescriptionFk', 'ProjectId', 'EngDrawingFk', 'MaterialFk', 'LgmJobFk', 'ExternalCode', 'PpsStrandPatternFk', 'IsLive', 'Guid'],
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
			ProductStatusFk: BasicsSharedLookupOverloadProvider.providePpsProductStatusLookupOverload(true),
			EngDrawingFk: {},
			PpsStrandPatternFk: {},
			ProductionSetFk: {},
			TrsProductBundleFk: {},
			TrsRequisitionFk: {},
			ItemFk: {},
			PpsProcessFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					showDialog: true,
					showClearButton: true,
					dataServiceToken: PpsProcessCommonLookupService,
				}),
			},
			PpsProductionSetSubFk: {},
			ProdPlaceFk: {},
			ProjectId: {},
			MaterialFk: {},
			LgmJobFk: {},
			PrjLocationFk: {},
			PuPrjLocationFk: {},
			PrjStockFk: {},
			PrjStockLocationFk: {},
			BasUomBillFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomPlanFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomAreaFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomVolumeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
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
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				FabriCode: { key: 'product.FabriCode', text: '*Fabrication Unit Code' },
				FabriExternalCode: { key: 'product.FabriExternalCode', text: '*Fabrication Unit ExternalCode' },
				ExternalCode: { key: 'product.externalCode', text: '*ExternalCode' },
				EngDrawingFk: { key: 'product.drawing', text: '*Drawing' },
				Length: { key: 'product.length', text: '*Length' },
				Width: { key: 'product.Width', text: '*Width' },
				Height: { key: 'product.Height', text: '*Height' },
				BasUomLengthFk: { key: 'product.lengthUoM', text: '*Length UoM' },
				BasUomWidthFk: { key: 'product.widthUoM', text: '*Width UoM' },
				BasUomHeightFk: { key: 'product.heightUoM', text: '*Height UoM' },
				BasUomAreaFk: { key: 'product.areaUoM', text: '*Area UoM' },
				BasUomVolumeFk: { key: 'product.volumeUoM', text: '*Volume UoM' },
				Area: { key: 'product.area', text: '*Area' },
				Area2: { key: 'product.area2', text: '*Area2' },
				Area3: { key: 'product.area3', text: '*Area3' },
				Volume: { key: 'product.volume', text: '*Volume' },
				Volume2: { key: 'product.volume2', text: '*Volume2' },
				Volume3: { key: 'product.volume3', text: '*Volume3' },
				PlanQuantity: { key: 'product.planQuantity', text: '*Plan Quantity' },
				BillQuantity: { key: 'product.billQuantity', text: '*Bill Quantity' },
				ProductDescriptionFk: { key: 'product.productDescriptionFk', text: '*Product Template' },
				TrsProductBundleFk: { key: 'product.trsProductBundleFk', text: '*Bundle' },
				PpsStrandPatternFk: { key: 'entityStrandPattern', text: '*Strand Pattern' },
			}),
		},
	},
});
