/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccordionItem } from './interfaces/accordion-item.interface';
import { IAccordionConfig } from './interfaces/accordion-config.interface';

/**
 * Accordion context, useful for item component
 */
export class AccordionContext {
	/**
	 * default constructor
	 * @param data
	 * @param config
	 */
	public constructor(public data: IAccordionItem, public config: IAccordionConfig) {

	}
}