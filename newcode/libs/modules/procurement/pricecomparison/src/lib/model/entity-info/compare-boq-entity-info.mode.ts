/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICompositeBoqEntity } from '../entities/boq/composite-boq-entity.interface';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../services/data/boq/compare-boq-data.service';
import { ProcurementPricecomparisonCompareBoqBehaviorService } from '../../behaviors/boq/compare-boq-behavior.service';

export const COMPARE_BOQ_ENTITY_INFO = EntityInfo.create<ICompositeBoqEntity>({
	grid: {
		title: {
			text: 'Price Comparison (BoQ)',
			key: 'procurement.pricecomparison.priceComparisonBoqTitle'
		},
		treeConfiguration: true,
		behavior: ctx => ctx.injector.get(ProcurementPricecomparisonCompareBoqBehaviorService),
	},
	dataService: ctx => ctx.injector.get(ProcurementPricecomparisonCompareBoqDataService),
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
	permissionUuid: '8b9a53f0a1144c03b8447a99f7b38448'
});