/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../enum/menulist-item-type.enum';
import { IMenuItem } from './index';

/**
 * Represents a divider.
 * Please double-check whether you are not actually defining a sublist of items (which will
 * automatically be displayed with dividers).
 *
 * @group Menu List
 */
export interface IDividerMenuItem<TContext = void> extends IMenuItem<TContext> {

	type: ItemType.Divider;
}
