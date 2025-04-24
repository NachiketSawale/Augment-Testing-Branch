import { EntityInfo } from '@libs/ui/business-base';
import { IEstPriceAdjustmentTotalEntity } from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentTotalDataService } from './estimate-price-adjustment-total.data.service';
import { EstimatePriceAdjustmentTotalValidationService } from './estimate-price-adjustment-total-validation.service';
import { EstimatePriceAdjustmentTotalBehavior } from './estimate-price-adjustment-total-behavior.service';
import { EstimatePriceAdjustmentTotalLayoutService } from './estimate-price-adjustment-total-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';

/**
 * Estimate Price Adjustment total Entity Info
 */
export const ESTIMATE_PRICE_ADJUSTMENT_TOTAL_ENTITY_INFO = EntityInfo.create<IEstPriceAdjustmentTotalEntity>({
    grid: {
        title: { text: 'Price Adjustment total', key: 'estimate.main.priceAdjust.total' },
        containerUuid: '07a3c46b264a4c7898c108f17488768b'
    },
    dataService: ctx => ctx.injector.get(EstimatePriceAdjustmentTotalDataService),
    entitySchema: {
        schema: 'EstPriceAdjustmentItemTotalDto',
        properties: {
            AdjType: {domain: EntityDomainType.Text, mandatory: false},
            TenderPrice: {domain: EntityDomainType.Integer, mandatory: false},
            DeltaA:{domain: EntityDomainType.Integer, mandatory: false},
            DeltaB: {domain: EntityDomainType.Integer, mandatory: false},
            EstimatedPrice: {domain: EntityDomainType.Integer, mandatory: false},
            AdjustmentPrice: {domain: EntityDomainType.Integer, mandatory: false},
            Quantity: {domain: EntityDomainType.Text, mandatory: false},
            Id:{domain: EntityDomainType.Integer, mandatory: false}
        },
    },
    permissionUuid: '6e1c35741cbe47269d291ee0a7e09e44',
    layoutConfiguration: context => {
        return context.injector.get(EstimatePriceAdjustmentTotalLayoutService).generateLayout();
    },
    containerBehavior:ctx => ctx.injector.get(EstimatePriceAdjustmentTotalBehavior),
    validationService:ctx=>ctx.injector.get(EstimatePriceAdjustmentTotalValidationService)
});
