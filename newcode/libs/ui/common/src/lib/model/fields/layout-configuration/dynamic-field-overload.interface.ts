/*
 * Copyright(c) RIB Software GmbH
 */

import {FieldType, IFieldOverload} from '../../fields';
import {IAdditionalDynamicOptions} from '../additional/additional-dynamic-options.interface';

/**
 * Dynamic field overload
 */
export interface IDynamicFieldOverload <T extends object> extends IFieldOverload<T>, IAdditionalDynamicOptions<T> {
    /**
     * A concrete type to use.
     */
    readonly type?: FieldType.Dynamic;
}