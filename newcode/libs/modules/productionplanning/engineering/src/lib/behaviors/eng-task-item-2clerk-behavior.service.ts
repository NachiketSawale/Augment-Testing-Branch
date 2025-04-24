/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {
    EntityContainerCommand,
    IEntityContainerBehavior,
    IGridContainerLink
} from '@libs/ui/business-base';

import {EngTaskItem2clerkDataService} from '../services/eng-task-item-2clerk-data.service';
import {IPPSItem2ClerkEntity} from '@libs/productionplanning/item';

@Injectable({
    providedIn: 'root'
})
export class EngTaskItem2clerkBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPPSItem2ClerkEntity>, IPPSItem2ClerkEntity> {

    private dataService: EngTaskItem2clerkDataService;

    public constructor() {
        this.dataService = inject(EngTaskItem2clerkDataService);
    }

    public onCreate(containerLink: IGridContainerLink<IPPSItem2ClerkEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IPPSItem2ClerkEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
    }
}