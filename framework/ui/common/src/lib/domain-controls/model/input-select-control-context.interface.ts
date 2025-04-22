/**
 * Copyright(c) RIB Software GmbH
 */

import { IAdditionalInputSelectOptions } from './../../model/fields/additional/additional-input-select-options.interface';
import { IControlContext } from './control-context.interface';
import { PropertyType } from '@libs/platform/common';

export interface IInputSelectControlContext extends IControlContext<PropertyType>, IAdditionalInputSelectOptions {}
