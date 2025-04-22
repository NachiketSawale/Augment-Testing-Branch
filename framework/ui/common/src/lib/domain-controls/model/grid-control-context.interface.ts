/*
 * Copyright(c) RIB Software GmbH
 */

import { IAdditionalGridOptions } from '../../model/fields';
import { IControlContext } from './control-context.interface';

export interface IGridControlContext extends IControlContext<[]>, IAdditionalGridOptions {
}
