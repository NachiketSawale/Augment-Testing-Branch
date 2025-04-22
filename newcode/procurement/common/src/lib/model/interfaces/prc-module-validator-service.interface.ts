/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';

/**
 * The interface for procurement header service
 */
export interface IPrcModuleValidatorService<T extends object, U extends CompleteIdentification<T>> extends IReadonlyParentService<T, U> {

    /**
     * whether the current data is valid for the submodule
     */
    isValidForSubModule(): boolean;

    /**
     * get the internal module name
     */
    getInternalModuleName(): string;
}
