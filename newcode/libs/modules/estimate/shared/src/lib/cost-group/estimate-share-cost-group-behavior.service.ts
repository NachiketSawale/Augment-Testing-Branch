/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import {CompleteIdentification} from '@libs/platform/common';
import {EstimateShareCostGroupCatalogDataService} from './estimate-share-cost-group-catalog-data.service';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {ItemType} from '@libs/ui/common';

@Injectable({
    providedIn: 'root',
})
export class EstimateShareCostGroupBehaviorService<T extends ICostGroupEntity,PT extends BasicsCostGroupCatalogEntity,PU extends CompleteIdentification<T>,U extends object> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
    protected parentService:EstimateShareCostGroupCatalogDataService<PT,PU,U>;

    /**
     * The constructor
     * @param dataService
     */
    public constructor(public dataService: EstimateShareCostGroupCatalogDataService<PT,PU,U>) {
        this.parentService = dataService;
    }
    public onCreate(containerLink: IGridContainerLink<T>): void {
        this.customizeToolbar(containerLink);
    }
    private customizeToolbar(containerLink: IGridContainerLink<T>) {
        containerLink.uiAddOns.toolbar.addItems([
            {
                id: 'collapsenode',
                caption: { key: 'cloud.common.toolbarCollapse' },
                iconClass: ' tlb-icons ico-tree-collapse',
                type: ItemType.Item,
                fn: () => {
                    //TODO: Implement pending of pin to desktop as a tile.
                },
                sort: 60,
            },
            {
                id: 'expandnode',
                caption: { key: 'cloud.common.toolbarExpand' },
                iconClass: ' tlb-icons ico-tree-expand',
                type: ItemType.Item,
                fn: () => {
                    //TODO: Implement pending of pin to desktop as a tile.
                },
                sort: 70,
            },
            {
                id: 'collapseall',
                caption: { key: 'cloud.common.toolbarCollapseAll' },
                iconClass: 'tlb-icons ico-tree-collapse-all',
                type: ItemType.Item,
                fn: () => {
                    //TODO: Implement pending of pin to desktop as a tile.
                },
                sort: 80,
            },
            {
                id: 'expandall',
                caption: { key: 'cloud.common.toolbarExpandAll' },
                iconClass: 'tlb-icons ico-tree-expand-all',
                type: ItemType.Item,
                fn: () => {
                    //TODO: Implement pending of pin to desktop as a tile.
                },
                sort: 90,
            }
        ]);
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

    public onInit(containerLink: IGridContainerLink<T>): void {
        this.parentService.refreshAll();
    }
}



