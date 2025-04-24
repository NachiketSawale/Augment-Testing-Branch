/*
 * Copyright(c) RIB Software GmbH
 */

import {ColumnDef} from '@libs/ui/common';

/**
 * Lookup layout generator interface
 * Could be used to generate grid columns for lookup from entity info
 */
export interface ILookupLayoutGenerator<T extends object> {
    /**
     * Generate grid columns for lookup
     */
    generateLookupColumns(): Promise<ColumnDef<T>[]>;
}