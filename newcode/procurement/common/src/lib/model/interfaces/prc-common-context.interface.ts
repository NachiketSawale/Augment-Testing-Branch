/*
 * Copyright(c) RIB Software GmbH
 */

export interface PrcCreateContext {
    MainItemId?: number;
    PrcConfigFk?: number;
    StructureFk?: number;
    ProjectFk?: number;
}

export interface PrcLoadContext {
    MainItemId?: number;
    ProjectId?: number;
    moduleName?: string;
}

export interface IHasItemsOrBoqsContext {
    items?: boolean;
    prcboqs?: boolean;
    boqitems?: boolean;
}
