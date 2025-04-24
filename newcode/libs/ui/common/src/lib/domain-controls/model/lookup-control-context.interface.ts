/*
 * Copyright(c) RIB Software GmbH
 */

import { ReferenceType } from '@libs/platform/common';
import { IControlContext } from './control-context.interface';
import { IAdditionalLookupOptions } from '../../model/fields/additional/additional-lookup-options.interface';

export interface ILookupControlContext<T extends object> extends IControlContext<ReferenceType, T>, IAdditionalLookupOptions<T> {
}