/*
 * Copyright(c) RIB Software GmbH
 */

import { AccordionItemAction } from './accordion-item-action.type';

/**
 * Additional settings for accordion actions.
 */
export interface IAccordionActionSettings {
	/**
	 * Hide on accordion header
	 */
	hideOnHeader?: boolean;

	/**
	 * Hide on accordion item
	 */
	hideOnItem?: boolean;
}

/**
 * An accordion action.
 */
export type AccordionAction = AccordionItemAction & IAccordionActionSettings;
