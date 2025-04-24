/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})

/**
 * Sales Common Default Sidebar Options Service
 */
export class SalesCommonDefaultSidebarOptionsService {
    public defaultSidebarOptions = {
        enhancedSearchEnabled: true,
        pattern: '',
        pageSize: 100,
        useCurrentClient: true,
        includeNonActiveItems: false,
        showOptions: true,
        showProjectContext: false,
        withExecutionHints: false
    };
}
