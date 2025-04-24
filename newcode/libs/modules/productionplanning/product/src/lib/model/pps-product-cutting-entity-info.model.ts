/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { PpsCuttingProductDataService } from '../services/pps-product-cutting-data.service';
import { IPpsCuttingProductVEntity } from './entities/pps-cutting-product-v-entity.interface';
import {PpsProductCuttingGridBehavior} from '../behaviors/pps-product-cutting-behavior.service';

export const PPS_CUTTING_PRODUCT_V_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsCuttingProductVEntity>({
	grid: {
		title: { key: 'productionplanning.product.cuttingProduct.listTitle' },
		behavior: (ctx) => ctx.injector.get(PpsProductCuttingGridBehavior),
		containerUuid: 'f5caf5e53c254ad3b9ee9c6b67b42906',
	},
	dataService: ctx => ctx.injector.get(PpsCuttingProductDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Product', typeName: 'PpsCuttingProductVDto' },
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ProductCode', 'ProductDescription', 'ProductProductionDate', 'ProductLengthInfo', 'ProductWidthInfo', 'ProductHeightInfo',
					'ScrpProductCode', 'ScrpProductDescription', 'ScrpProductLengthInfo', 'ScrpProductWidthInfo', 'ScrpProductHeightInfo', 'KeepRemainingLength', 'KeepRemainingWidth','Order']
			}
		],

		overloads: {

		},

		labels: {
			...prefixAllTranslationKeys('productionplanning.product.cuttingProduct.', {
				ProductCode: { key: 'productCode', text: '*Product' },
				ProductDescription: { key: 'productDesc', text: '*Product Description' },
				ProductLengthInfo: { key: 'productLength', text: '*Product Length' },
				ProductWidthInfo: { key: 'productCode', text: '*Product Width' },
				ProductHeightInfo: { key: 'productCode', text: '*Product Height' },
				ScrpProductCode: { key: 'scrpProductCode', text: '*Replacing-Scrap Product' },
				ScrpProductDescription: { key: 'cuttingProduct.scrpProductDesc', text: '*Replacing-Scrap Product Description' },
				ScrpProductLengthInfo: { key: 'cuttingProduct.scrpProductLength', text: '*Replacing-Scrap Product Length' },
				ScrpProductWidthInfo: { key: 'cuttingProduct.scrpProductWidth', text: '*Replacing-Scrap Product Width' },
				ScrpProductHeightInfo: { key: 'cuttingProduct.scrpProductHeight', text: '*Replacing-Scrap Product Height' },
				KeepRemainingLength: { key: 'cuttingProduct.keepRemainingLength', text: '*Keep Remaining Length' },
				KeepRemainingWidth: { key: 'cuttingProduct.keepRemainingLength', text: '*Keep Remaining Width' },
				ProductProductionDate: { key: 'cuttingProduct.productProductionDate', text: '*Production Date' },
				Order: { key: 'cuttingProduct.order', text: '*Cutting Order' }
			})
		}
	}
});