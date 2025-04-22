/*
 * Copyright(c) RIB Software GmbH
 */

import { ColorType } from '@libs/platform/common';
import { IControlContext } from './control-context.interface';
import { IAdditionalColorOptions } from '../../model/fields/additional/additional-color-options.interface';

export interface IColorControlContext extends IControlContext<ColorType>, IAdditionalColorOptions {
}