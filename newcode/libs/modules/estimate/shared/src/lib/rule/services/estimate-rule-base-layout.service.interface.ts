/*
 * Copyright(c) RIB Software GmbH
 */

import {ILayoutConfiguration} from '@libs/ui/common';
import {IEstRuleEntity} from '@libs/estimate/interfaces';

/**
 * Interface for lineItem layout.
 */
export interface IEstimateRuleBaseLayoutServiceInterface<T extends IEstRuleEntity>{
    /**
     * generate layout
     */
    generateLayout(ruleType: number): Promise<ILayoutConfiguration<T>>;
}