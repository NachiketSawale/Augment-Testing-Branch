/*
 * Copyright(c) RIB Software GmbH
 */

import { IParentMenuItem } from './index';
import { ItemType } from '../enum/menulist-item-type.enum';

/**
 * A dropdown menu item.
 *
 * @group Menu List
 */
export interface IDropdownBtnMenuItem<TContext = void> extends IParentMenuItem<TContext> {

	type: ItemType.DropdownBtn;
}
