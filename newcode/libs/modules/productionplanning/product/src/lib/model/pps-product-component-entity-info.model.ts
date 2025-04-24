/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

import { PpsProductComponentDataService } from '../services/pps-product-component-data.service';
import { IEngProdComponentEntity } from './entities/eng-prod-component-entity.interface';
import { PpsProductComponentBehavior } from '../behaviors/pps-product-component-behavior.service';

export const PPS_ENGINEER_PRODUCT_COMPONENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngProdComponentEntity>({
	grid: {
		title: { key: 'productionplanning.product.engProdComponent.listTitle' },
		behavior: ctx => ctx.injector.get(PpsProductComponentBehavior),
		containerUuid: 'a114adb7f3cd421080fb1bdf7e137761',
	},
	form: {
		title: { key: 'productionplanning.product.engProdComponent.detailTitle' },
		containerUuid: 'b92b2f30636042308bb965d23bb55723',
	},
	dataService: ctx => ctx.injector.get(PpsProductComponentDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Product', typeName: 'EngProdComponentDto' },
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Description', 'EngDrawingComponentFk', 'EngDrwCompTypeFk', 'MdcMaterialCostCodeProductFk',
					'EngDrawingFk', 'PrcStockTransactionFk', 'Sorting', 'IsLive']
			},
			{
				gid: 'qtyGroup',
				attributes: ['Quantity', 'BasUomFk', 'Quantity2', 'BasUomQty2Fk', 'Quantity3', 'BasUomQty2Fk']
			},
			{
				gid: 'actQtyGroup',
				attributes: ['ActualQuantity', 'BasUomActQtyFk', 'ActualQuantity2', 'BasUomActQty2Fk', 'ActualQuantity3', 'BasUomActQty3Fk']
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
			},
			{
				gid: 'userFlagGroup',
				attributes: ['UserFlag1', 'UserFlag2']
			},
			{
				gid: 'reservedGroup',
				attributes: ['Reserved1', 'Reserved2']
			},
		],

		overloads: {
			EngDrawingFk: {}, EngDrawingComponentFk: {}, MdcMaterialCostCodeProductFk: {},
			PrcStockTransactionFk: {},
			EngDrwCompTypeFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingComponentTypeLookupOverload(true),
			BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomQty2Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomQty3Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomActQtyFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomActQty2Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			BasUomActQty3Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '1' }
				},
				type: FieldType.Description
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '2' }
				},
				type: FieldType.Description
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '3' }
				},
				type: FieldType.Description
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '4' }
				},
				type: FieldType.Description
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '5' }
				},
				type: FieldType.Description
			},
		},

		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Quantity: { key: 'entityQuantity', text: '*Quantity' },
			}),
			...prefixAllTranslationKeys('productionplanning.drawing.', {
				Quantity2: { key: 'entityQuantity', text: '*Quantity2' },
				Quantity3: { key: 'entityQuantity', text: '*Quantity3' },
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				FabriCode: { key: 'product.FabriCode', text: '*Fabrication Unit Code' },
				ActualQuantity: { key: 'actualQuantity', text: '*Actual Quantity' },
				ActualQuantity2: { key: 'actualQuantity2', text: '*Actual Quantity2' },
				ActualQuantity3: { key: 'actualQuantity3', text: '*Actual Quantity3' },
				BasUomActQtyFk: { key: 'entityActUoM', text: '*Actual UoM' },
				BasUomActQty2Fk: { key: 'entityActUoM2', text: '*Actual UoM2' },
				BasUomActQty3Fk: { key: 'entityActUoM3', text: '*Actual UoM3' },
				UserFlag1: { key: 'event.userflag1', text: '*Userflag1' },
				UserFlag2: { key: 'event.userflag2', text: '*Userflag2' },
				Reserved1: { key: 'reserved1', text: '*Reserved1' },
				Reserved2: { key: 'reserved2', text: '*Reserved2' },
			}),
		}
	}
});