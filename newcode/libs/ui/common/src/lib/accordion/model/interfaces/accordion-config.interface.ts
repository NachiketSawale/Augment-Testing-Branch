/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';
import { AccordionAction } from './accordion-action.type';

/**
 * Accordion options
 */
export interface IAccordionOptions {
	/**
	 * multiple panel mode
	 */
	multi?: boolean;
	/**
	 * custom item component, work for whole accordion
	 */
	itemComponent?: Type<unknown>;
	/**
	 * Custom providers for item component, work for whole accordion
	 */
	itemProviders?: StaticProvider[];

	/**
	 * Only expand panel by clicking expansion indicator, otherwise whole expansion header works
	 */
	onlyExpandByIndicator?: boolean;
	/**
	 * The display direction of action button, 'row' | 'column', default is 'row'
	 */
	actionButtonDirection?: string;
	/**
	 * Custom action buttons, will work for all accordion items with default content
	 */
	actionButtons?: AccordionAction[];
}

/**
 * Accordion config
 */
export interface IAccordionConfig extends IAccordionOptions {
	/**
	 * required
	 */
	itemComponent: Type<unknown>;
	/**
	 * Required
	 */
	actionButtonDirection: string;
}
