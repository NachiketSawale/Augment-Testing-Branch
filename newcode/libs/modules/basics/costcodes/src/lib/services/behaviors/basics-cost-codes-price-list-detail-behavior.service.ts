/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
export const BASICS_COST_CODES_PRICE_LIST_DETAILS_BEHAVIOR_TOKEN = new InjectionToken<BasicsCostCodesPriceListDetailsBehavior>('basicsCostCodesPriceListDetailsBehaviorToken');

@Injectable({
    providedIn: 'root'
})

/*
 * Service to handle behaviors related to Basics Cost Codes Price List Details
 */
export class BasicsCostCodesPriceListDetailsBehavior implements IEntityContainerBehavior<IFormContainerLink<ICostcodePriceListEntity>, ICostcodePriceListEntity> {
    public onCreate(containerLink: IFormContainerLink<ICostcodePriceListEntity>): void {
        this.addItemsToToolbar(containerLink);
    }

    /**
     * Method to customize tool bar
     * @param containerLink 
     */
    private addItemsToToolbar(containerLink: IFormContainerLink<ICostcodePriceListEntity>) {
        const customToolbarItems: ConcreteMenuItem[] = [
            {
                caption: 'First',
                hideItem: false,
                iconClass: ' tlb-icons ico-rec-first',
                id: 'first',
                sort: 101,
                type: ItemType.Item
            },
            {
                caption: 'Previous',
                hideItem: false,
                iconClass: ' tlb-icons ico-rec-previous',
                id: 'previous',
                sort: 102,
                type: ItemType.Item
            },
            {
                caption: 'Next',
                hideItem: false,
                iconClass: ' tlb-icons ico-rec-next',
                id: 'next',
                sort: 103,
                type: ItemType.Item
            },
            {
                caption: 'Last',
                hideItem: false,
                iconClass: ' tlb-icons ico-rec-last',
                id: 'last',
                sort: 104,
                type: ItemType.Item
            }
        ];

        containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
    }
}
