/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {inject, Injectable} from '@angular/core';
import {QtoMainSubtotalDataService} from './qto-main-subtotal-data.service';

@Injectable({
    providedIn: 'root'
})
export class QtoMainSubtotalBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IQtoMainDetailGridEntity>, IQtoMainDetailGridEntity> {
    private dataService: QtoMainSubtotalDataService;

    public constructor() {
        this.dataService = inject(QtoMainSubtotalDataService);
    }
    public onCreate(containerLink: IGridContainerLink<IQtoMainDetailGridEntity>): void {
        containerLink.uiAddOns.toolbar.deleteItems(['create','delete']);
    }
}