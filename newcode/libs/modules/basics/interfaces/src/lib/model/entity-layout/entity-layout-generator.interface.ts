/*
 * Copyright(c) RIB Software GmbH
 */

import {ILayoutConfiguration} from '@libs/ui/common';

/**
 * Entity layout generator interface
 */
export interface IEntityLayoutGenerator<T extends object> {
    /**
     * Generate layout configuration
     */
    generateLayout(): ILayoutConfiguration<T>;
}