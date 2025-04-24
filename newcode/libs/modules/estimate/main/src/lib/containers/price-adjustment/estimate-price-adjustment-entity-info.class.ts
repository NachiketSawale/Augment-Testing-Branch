import { EntityInfo } from '@libs/ui/business-base';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { EstimatePriceAdjustmentDataService } from './estimate-price-adjustment.data.service';
import { EstimatePriceAdjustmentBehavior } from './estimate-price-adjustment-behavior.service';
import { EstimatePriceAdjustmentLayoutService } from './estimate-price-adjustment-layout.service';
import { EstimatePriceAdjustmentValidationService } from './estimate-price-adjustment-validation.service';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

/**
 * Estimate Resource Entity Info
 */
export const ESTIMATE_PRICE_ADJUSTMENT_ENTITY_INFO = EntityInfo.create<IEstPriceAdjustmentItemData>({
	grid: {
		title: { text: 'Price Adjustment', key: 'estimate.main.priceAdjustment.adjustment' },
		containerUuid: '6e1c35741cbe47269d291ee0a7e09e44',
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IEstPriceAdjustmentItemData) {
					const service = ctx.injector.get(EstimatePriceAdjustmentDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IEstPriceAdjustmentItemData) {
					const service = ctx.injector.get(EstimatePriceAdjustmentDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IEstPriceAdjustmentItemData>;
		},
	},
	dataService: (ctx) => ctx.injector.get(EstimatePriceAdjustmentDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstPriceAdjustmentItemDataDto' },
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: (context) => {
		return context.injector.get(EstimatePriceAdjustmentLayoutService).generateLayout();
	},
	containerBehavior: (ctx) => ctx.injector.get(EstimatePriceAdjustmentBehavior),
	validationService: (ctx) => ctx.injector.get(EstimatePriceAdjustmentValidationService),
});
