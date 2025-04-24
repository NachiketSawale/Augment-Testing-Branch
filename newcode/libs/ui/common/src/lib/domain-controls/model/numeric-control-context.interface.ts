/*
 * Copyright(c) RIB Software GmbH
 */

import { IAdditionalNumericOptions } from '../../model/fields/additional/additional-numeric-options.interface';
import { IControlContext } from './control-context.interface';

export interface INumericControlContext extends IControlContext<number>, IAdditionalNumericOptions {
}