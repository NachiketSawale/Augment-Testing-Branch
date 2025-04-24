/*
 * Copyright(c) RIB Software GmbH
 */

import {ILayoutConfiguration} from '@libs/ui/common';
import {IMaterialPriceConditionEntity} from '@libs/basics/interfaces';

/**
 * Interface for price condition layout.
 */
export interface IBasicsSharedPriceConditionBaseLayoutService<T extends IMaterialPriceConditionEntity> {
    /**
     * generate layout
     */
    generateLayout(): Promise<ILayoutConfiguration<T>>;
}