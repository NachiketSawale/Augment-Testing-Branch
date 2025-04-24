/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, InjectionToken, inject} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

import {ISearchPayload} from '@libs/platform/common';
import {IEstLineItemQuantityEntity} from '@libs/estimate/interfaces';
import {EstimateMainLineItemQuantityDataService} from './estimate-main-line-item-quantity-data.service';

/*
 * Define an InjectionToken for the Estimate Main LineItem Quantity behavior
 */
export const ESTIMATE_MAIN_LINE_ITEM_QUANTITY_BEHAVIOR_TOKEN = new InjectionToken<EstimateMainLineItemQuantityBehavior>('estimateMainLineItemQuantityBehavior');

@Injectable({
    providedIn: 'root'
})
export class EstimateMainLineItemQuantityBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemQuantityEntity>, IEstLineItemQuantityEntity> {

    private dataService: EstimateMainLineItemQuantityDataService;

    private searchPayload: ISearchPayload = {
        executionHints: false,
        filter: '',
        includeNonActiveItems: false,

        isReadingDueToRefresh: false,
        pageNumber: 0,
        pageSize: 100,
        pattern: '',
        pinningContext: [],
        projectContextId: null,
        useCurrentClient: true
    };

    /*
     * Constructor to inject DataService
     */
    public constructor() {
        this.dataService = inject(EstimateMainLineItemQuantityDataService);
    }

    /*
     * Method called when a container is created
     */
    public onCreate(containerLink: IGridContainerLink<IEstLineItemQuantityEntity>): void {
        const dataSub = this.dataService.listChanged$.subscribe((data) => {
            containerLink.gridData = data;
        });

        this.customizeToolbar(containerLink);
        containerLink.registerSubscription(dataSub);
    }

    /*
     * Method to customize toolbar items
    */

    private customizeToolbar(containerLink: IGridContainerLink<IEstLineItemQuantityEntity>) {
        //TODO : Delete bulk editor
        //containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
    }

}
