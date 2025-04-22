/**
 * Copyright(c) RIB Software GmbH
 */

import { IGridApi } from '../../../grid';
import { IMenuItemsList } from '../../menu-list/interface';

/**
 * Declares additional options that are specific to grid control.
 *
 * @group Fields API
 */

export interface IAdditionalGridFormOptions  {
	tools?: (info: IGridApi<object>) => IMenuItemsList<void>;
}
