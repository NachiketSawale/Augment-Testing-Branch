import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { IEstPriceAdjustmentTotalEntity } from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentTotalDataService } from './estimate-price-adjustment-total.data.service';

/**
 * Service to handle behaviors related to Price Adjustment Total
 */
@Injectable({
    providedIn: 'root'
})
export class  EstimatePriceAdjustmentTotalBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstPriceAdjustmentTotalEntity>, IEstPriceAdjustmentTotalEntity> {

    /**
     * EstimatePriceAdjustmentTotalBehavior constructor
     * @param dataService EstimatePriceAdjustmentTotal
     */
    public constructor(private dataService: EstimatePriceAdjustmentTotalDataService) {
    }

    /**
     * Method to call when a container is created
     * @param containerLink
     */
    public onCreate(containerLink: IGridContainerLink<IEstPriceAdjustmentTotalEntity>): void {
        this.customizeToolbar(containerLink);
    }

    /**
     * Private method to customize the toolbar with additional items
     * @param containerLink
     * @private
     */
    private customizeToolbar(containerLink: IGridContainerLink<IEstPriceAdjustmentTotalEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}