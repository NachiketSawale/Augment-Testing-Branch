/*
 * Copyright(c) RIB Software GmbH
 */

import { IAdditionalTimeOptions } from '../../model/fields/additional/additional-time-options.interface';
import { IControlContext } from './control-context.interface';

/**
 * Interface time result and additional options
 */
export interface ITimeControlContext extends IControlContext<Date>, IAdditionalTimeOptions {}
