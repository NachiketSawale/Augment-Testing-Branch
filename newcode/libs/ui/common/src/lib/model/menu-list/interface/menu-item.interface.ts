/*
 * Copyright(c) RIB Software GmbH
 */

import { Permissions, Translatable } from '@libs/platform/common';
import { ItemType } from '../enum/menulist-item-type.enum';
import { IMenuItemEventInfo } from './menu-item-event-info.interface';


/**
 * The base interface for items in the menu list.
 *
 * @typeParam TContext An object that represents the context in which the menulist appears.
 *
 * @group Menu List
 */
export interface IMenuItem<TContext = void> {
	/**
	 * The item id .
	 */
	id?: string;

	/**
	 * Id of group
	 */
	groupId?: string;

	/**
	 * The item type.
	 */
	type?: ItemType;

	/**
	 * The button caption
	 */
	caption?: Translatable | ((info: IMenuItemEventInfo<TContext>) => Translatable);

	/**
	 * Css class for button
	 */
	cssClass?: string;

	/**
	 * To disable property of item
	 */
	disabled?: boolean | ((info: IMenuItemEventInfo<TContext>) => boolean);

	/**
	 * Indicates whether the item should be hidden.
	 */
	hideItem?: boolean | ((info: IMenuItemEventInfo<TContext>) => boolean);

	/**
	 * The item icon class
	 */
	iconClass?: string;

	/**
	 * Permission for each item
	 */
	permission?: string | Record<string, Permissions>;

	/**
	 * SVG image
	 */
	svgImage?: string;

	/**
	 * indicates svg icon
	 */
	svgSprite?: string;

	/**
	 * for sort
	 */
	sort?: number;

	/**
	 * to check whether toolitem is set or not
	 */
	isSet?: boolean;

	/**
	 * for Display
	 */
	isDisplayed?: boolean;

	/**
	 *  item Function
	 */
	fn?: (info: IMenuItemEventInfo<TContext>) => Promise<void> | void;

	/**
	 *  Layout Mode
	 */
	layoutModes?: string;

	/**
	 *  to check layout changable or not
	 */
	layoutChangeable?: boolean;
}