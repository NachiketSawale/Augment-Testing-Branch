/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { AccordionItemAction } from './accordion-item-action.type';

/**
 * Accordion item interface
 */
export interface IAccordionItem {
	/**
	 * The identifier
	 */
	id: number | string;
	/**
	 * Item title
	 */
	title?: Translatable;
	/**
	 * Item comment
	 */
	comment?: Translatable;
	/**
	 * Hide this item?
	 */
	hidden?: boolean;
	/**
	 * Disable this item?
	 */
	disabled?: boolean;
	/**
	 * Expanded state, only valid for item having sub items
	 */
	expanded?: boolean;
	/**
	 * Item icon css class
	 */
	imgCss?: string;
	/**
	 * Item handler
	 */
	execute?: () => void;
	/**
	 * Has child or not, useful for lazy load sub items as a holder
	 */
	hasChild?: boolean;
	/**
	 * Sub item array
	 */
	children?: IAccordionItem[];
	/**
	 * Custom item component, inject data context {@link AccordionContext} object in component
	 */
	component?: Type<unknown>;
	/**
	 * Custom providers for item component
	 */
	providers?: StaticProvider[];
	/**
	 * Custom action buttons
	 */
	actionButtons?: AccordionItemAction[];
}