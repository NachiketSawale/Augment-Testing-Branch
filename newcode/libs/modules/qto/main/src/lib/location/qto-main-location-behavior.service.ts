/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {inject, Injectable} from '@angular/core';
import {QtoMainLocationDataService} from './qto-main-location-data.service';
import {IProjectLocationEntity} from '@libs/project/interfaces';
import {ItemType} from '@libs/ui/common';
@Injectable({
    providedIn: 'root'
})
export class QtoMainLocationBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IProjectLocationEntity>, IProjectLocationEntity> {
    private dataService: QtoMainLocationDataService;

    public constructor() {
        this.dataService = inject(QtoMainLocationDataService);
    }
    public onCreate(containerLink: IGridContainerLink<IProjectLocationEntity>): void {
        containerLink.uiAddOns.toolbar.addItems([
            {
                caption: { key: 'cloud.common.toolbarInsertSub' },
                hideItem: false,
                iconClass: ' tlb-icons ico-sub-fld-new',
                id: 'createChild',
                disabled: () => {
                    return !this.dataService.canCreateChild();
                },
                fn: () => {
                    this.dataService.createChild().then();
                },
                sort: 5,
                type: ItemType.Item,
            },
            {
                caption: { key: 'cloud.common.bulkEditor.title' },
                hideItem: false,
                iconClass: 'type-icons ico-construction51',
                id: 'bulkEditor',
                fn: () => {
                    throw new Error('This method is not implemented');
                },
                sort: 130,
                type: ItemType.Item,
            },
        ]);
        containerLink.uiAddOns.toolbar.deleteItems('grouping');
    }
}