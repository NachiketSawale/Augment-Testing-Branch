/*
 * Copyright(c) RIB Software GmbH
 */


import {PropertyType} from '@libs/platform/common';
import {IControlContext} from '../model/control-context.interface';
import {IAdditionalDynamicOptions} from '../../model/fields/additional/additional-dynamic-options.interface';

/**
 * Dynamic control context
 */
export interface IDynamicControlContext <T extends object> extends IControlContext<PropertyType, T>, IAdditionalDynamicOptions<T> {

}