/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IActionSelectBtnMenuItem,
	ICheckMenuItem,
	IDividerMenuItem,
	IDropdownBtnMenuItem, IMenuItem,
	IParentMenuItem,
	IRadioMenuItem,
	ISimpleMenuItem,
	ISubListMenuItem
} from './index';
import { ItemType } from '../enum/menulist-item-type.enum';
import { IOverflowBtnMenuItem } from './overflow-btn-menu-item.interface';
import { IFileSelectMenuItem } from './file-select-menu-item.interface';

/**
 * The union of all menu item types.
 *
 * @group Menu List
 */
export type ConcreteMenuItem<TContext = void> =
	ISimpleMenuItem<TContext> |
	ICheckMenuItem<TContext> |
	IRadioMenuItem<TContext> |
	ISubListMenuItem<TContext> |
	IDropdownBtnMenuItem<TContext> |
	IDividerMenuItem<TContext> |
	IOverflowBtnMenuItem<TContext> |
	IFileSelectMenuItem<TContext> |
	IActionSelectBtnMenuItem<TContext>;

/**
 * Checks whether a given menu item is a parent menu item.
 *
 * @param item The menu item to check.
 *
 * @group Menu List
 */
export function isParentMenuItem<TContext>(item: IMenuItem<TContext>): item is IParentMenuItem<TContext> {
	return item.type === ItemType.Sublist || item.type === ItemType.DropdownBtn || item.type === ItemType.OverflowBtn;
}
