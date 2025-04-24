/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ISearchPayload } from '@libs/platform/common';
import { BasicSite2ClerkDataService } from '../services/basic-site2-clerk-data.service';
import { BasicSite2ClerkEntity } from '../model/basic-site2-clerk-entity.class';
export const BASIC_SITE2_CLERK_BEHAVIOR_TOKEN = new InjectionToken<BasicsSite2ClerkBehavior>('BasicsSite2ClerkBehavior');

@Injectable({
    providedIn: 'root',
})
export class BasicsSite2ClerkBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicSite2ClerkEntity>, BasicSite2ClerkEntity> {
    private dataService: BasicSite2ClerkDataService;
    
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
        useCurrentClient: true,
    };

    public constructor() {
        this.dataService = inject(BasicSite2ClerkDataService);
    }

    public onCreate(containerLink: IGridContainerLink<BasicSite2ClerkEntity>): void {
        const dataSub = this.dataService.listChanged$.subscribe((data) => {
            containerLink.gridData = data;
        });
        containerLink.registerSubscription(dataSub);
    }

}
