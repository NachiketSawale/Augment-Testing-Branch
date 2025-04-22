/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from './control-context.interface';
import { IAdditionalLookupOptions } from '../../model/fields/additional/additional-lookup-options.interface';
import { LookupFreeInputType } from '../../../lib/lookup';

export interface ILookupInputSelectControlContext<T extends object> extends IControlContext<LookupFreeInputType, T>, IAdditionalLookupOptions<T> {
}