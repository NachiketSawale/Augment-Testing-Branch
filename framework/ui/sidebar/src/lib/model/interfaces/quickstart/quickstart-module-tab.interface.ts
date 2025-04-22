/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Tab items data from server.
 */
export interface IQuickstartModuleTab {
	/**
	 * Unique module fk.
	 */
	BasModuleFk: number;

	/**
	 * Tab item description.
	 */
	Description: string;

	/**
	 * Unique tab id.
	 */
	Id: number;

	/**
	 * Item insertion date.
	 */
	InsertedAt: string;

	/**
	 * Inserted by.
	 */
	InsertedBy: string;

	/**
	 * Is item visible.
	 */
	Isvisible: boolean;

	/**
	 * Item sorting index.
	 */
	Sorting: number;

	/**
	 * Version.
	 */
	Version: number;

	/**
	 * Item visibility.
	 */
	Visibility: number;
}
