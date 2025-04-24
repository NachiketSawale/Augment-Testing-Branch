/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken,inject } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { ICostCodeEntity } from '../../model/models';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';
export const BASICS_COST_CODES_DETAILS_BEHAVIOR_TOKEN = new InjectionToken<BasicsCostCodesDetailsBehavior>('basicsCostCodesDetailsBehaviorToken');

@Injectable({
    providedIn: 'root'
})
/**
 * Basics Cost Codes Details Behavior Service
 */
export class BasicsCostCodesDetailsBehavior implements IEntityContainerBehavior<IFormContainerLink<ICostCodeEntity>, ICostCodeEntity> {

    private dataService= inject(BasicsCostCodesDataService);
    
    /**
    *  Method called when a container is created
    * @param containerLink      
    */
    public onCreate(containerLink: IFormContainerLink<ICostCodeEntity>): void {
        this.addItemsToToolbar(containerLink);
    }

    /**
     * Method to customize toolbar
     * @param containerLink 
     */
    private addItemsToToolbar(containerLink: IFormContainerLink<ICostCodeEntity>) {
        const customToolbarItems: ConcreteMenuItem[] = [
            {
                caption: { key: 'cloud.common.toolbarInsertSub' },
                iconClass: 'tlb-icons ico-sub-fld-new',
                type: ItemType.Item,
                disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild().then();
				},
                sort: 1
            }
        ];

        containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
    }
}
