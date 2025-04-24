/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ISidebarWizardItem } from './sidebar-wizard-item.interface';

/**
 * Interface for wizards data(wizard group) fetched from APi.
 */
export interface ISidebarWizard {
	/**
	 * Icon for the wizard group.
	 */
	icon: string;

	/**
	 * Unique Id of the wizard group.
	 */
	id: number;

	/**
	 * Name of the wizard group.
	 */
	name: string;

	/**
	 * Sorting index of the wizard group.
	 */
	sorting: number;

	/**
	 * Visibilty state of the wizard group.
	 */
	visible: boolean;

	/**
	 * Wizard items in the wizard group.
	 */
	wizards: ISidebarWizardItem[];
}
