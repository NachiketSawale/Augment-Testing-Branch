/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for wizards data(wizard item) fetched from APi.
 */
export interface ISidebarWizardItem {
	/**
	 * Id of wizard item.
	 */
	id: number;

	/**
	 * Id of group to which item belongs.
	 */
	groupId: number;

	/**
	 * Unique Id of wizard item.
	 */
	w2GId: number;

	/**
	 * wizard item Guid.
	 */
	wizardGuid: string;

	/**
	 * Name of wizard item.
	 */
	name: string;

	/**
	 * Sorting index of the wizard item.
	 */
	sorting: number;

	/**
	 * Item Count in wizard group.
	 */
	parameters: number;

	/**
	 * Extra details of the wizard item.
	 */
	description?: string;
}
