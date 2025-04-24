/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { ICostCodeEntity } from '../../model/models';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';

export const BASICS_COST_CODES_BEHAVIOR_TOKEN = new InjectionToken<BasicsCostCodesBehavior>('basicsCostCodesBehaviorToken');

/**
 * Basics Cost Codes Behavior Service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsCostCodesBehavior implements IEntityContainerBehavior<IGridContainerLink<ICostCodeEntity>, ICostCodeEntity> {

    private dataService= inject(BasicsCostCodesDataService);

    /*
     * Constructor to inject DataService
     */
    public constructor() {
        this.dataService = inject(BasicsCostCodesDataService);
    }

    /**
     *  Method called when a container is created
     * @param containerLink      
     */
    public onCreate(containerLink: IGridContainerLink<ICostCodeEntity>): void {
        const dataSub = this.dataService.listChanged$.subscribe((data) => {
            containerLink.gridData = data;
        });

        this.customizeToolbar(containerLink);
        containerLink.registerSubscription(dataSub);
    }

    /**
     * Method to customize toolbar
     * @param containerLink 
     */
    private customizeToolbar(containerLink: IGridContainerLink<ICostCodeEntity>) {
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
                sort: 0
            }
        ];

        containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
    }

}
