/*
 * Copyright(c) RIB Software GmbH
 */

import {IControlContext} from './control-context.interface';
import { IAdditionalSelectOptions } from '../../model/fields/additional/additional-select-options.interface';
import { PropertyType } from '@libs/platform/common';

export interface ISelectControlContext extends IControlContext<PropertyType>, IAdditionalSelectOptions {
}