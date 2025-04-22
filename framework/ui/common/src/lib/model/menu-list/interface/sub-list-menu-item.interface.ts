/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../enum/menulist-item-type.enum';
import {
	IParentMenuItem
} from './index';

/**
 * A menu item that represents a group of other menu items.
 *
 * @group Menu List
 */
export interface ISubListMenuItem<TContext = void> extends IParentMenuItem<TContext> {

	type: ItemType.Sublist;
}
