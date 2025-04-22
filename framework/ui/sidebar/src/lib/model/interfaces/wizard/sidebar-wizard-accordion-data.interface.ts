/**
 * Copyright(c) RIB Software GmbH
 */

import { Dictionary, IInitializationContext } from '@libs/platform/common';
import { IAccordionItem } from '@libs/ui/common';

/**
 * Wizard interface for wizard data.
 */
export interface ISidebarWizardAccordionItem extends IAccordionItem {
	/**
	 * Group id for wizard item.
	 */
	groupId?: number;

	/**
	 * Unique id for wizard Item
	 */
	w2GId?: number;

	/**
	 * Pin status for wizard Item.
	 */
	isPinned?: boolean;

	/**
	 * Executes the wizard when item clicked.
	 */
	executeWizard?: (context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) => Promise<void> | undefined;
}
