/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICompositeItemEntity } from '../entities/item/composite-item-entity.interface';
import { ProcurementPricecomparisonCompareItemBehaviorService } from '../../behaviors/item/compare-item-behavior.service';
import { ProcurementPricecomparisonCompareItemDataService } from '../../services/data/item/compare-item-data.service';

export const COMPARE_ITEM_ENTITY_INFO = EntityInfo.create<ICompositeItemEntity>({
	grid: {
		title: {
			text: 'Price Comparison (Item)',
			key: 'procurement.pricecomparison.priceCompareTitle'
		},
		treeConfiguration: true,
		behavior: ctx => ctx.injector.get(ProcurementPricecomparisonCompareItemBehaviorService),
	},
	dataService: ctx => ctx.injector.get(ProcurementPricecomparisonCompareItemDataService),
	entitySchema: {
		schema: 'Composite',
		properties: {
			CompareDescription: {
				domain: EntityDomainType.Description,
				mandatory: false
			}
		}
	},
	layoutConfiguration: {
		labels: {
			...prefixAllTranslationKeys('procurement.pricecomparison.', {
				CompareDescription: 'compareDescription'
			})
		}
	},
	permissionUuid: 'ef496d027ad34b1f8fe282b1d6692ded'
});