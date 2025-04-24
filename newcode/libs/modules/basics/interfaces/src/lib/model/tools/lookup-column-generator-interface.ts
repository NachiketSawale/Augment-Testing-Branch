/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef } from '@libs/ui/common';

/**
 * Interface for generating lookup columns for a grid configuration.
 */
export interface ILookupColumnGenerator<T extends object> {
    /**
     * @returns A promise that resolves to an array of ColumnDef objects.
     */
    generateLookupColumns(): Promise<ColumnDef<T>[]>;
}
