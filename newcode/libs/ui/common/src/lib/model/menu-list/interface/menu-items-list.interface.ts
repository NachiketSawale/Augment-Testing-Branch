/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteMenuItem } from './concrete-menu-item.type';

/**
 * An interface for menulist
 *
 * @typeParam TContext An object that represents the context in which the menulist appears.
 *
 * @group Menu List
 */
export interface IMenuItemsList<TContext = void> {
	/**
	 * isVisible for visible and invisible toolbar
	 */
	isVisible?: boolean;
	/**
	 * Css class for ul
	 */
	cssClass?: string;

	/**
	 * Css class dropdown
	 */
	iconClass?: string;

	/**
	 * items for menulist
	 */
	items?: ConcreteMenuItem<TContext>[];

	/**
	 * To check whether to show images
	 */
	showImages?: boolean;

	/**
	 * To check whether to show titles
	 */
	showTitles?: boolean;

	/**
	 *
	 * The
	 */
	activeValue?: string | boolean | number | undefined;

	/**
	 * permission to overflow menuitems .
	 */
	overflow?: boolean;

	/**
	 * permission to change layout
	 */
	layoutChangeable?: boolean;
}
