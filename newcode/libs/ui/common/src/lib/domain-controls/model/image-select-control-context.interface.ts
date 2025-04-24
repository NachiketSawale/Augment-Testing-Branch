/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from './control-context.interface';
import { PropertyType } from '@libs/platform/common';
import { IAdditionalImageSelectOptions } from '../../model/fields/additional/additional-image-select-options.interface';

export interface IImageSelectControlContext extends IControlContext<PropertyType>, IAdditionalImageSelectOptions {}
