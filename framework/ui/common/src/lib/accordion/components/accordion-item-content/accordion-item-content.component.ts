/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { AccordionContext } from '../../model/accordion-context';
import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';

/**
 * default item content
 */
@Component({
	selector: 'ui-common-accordion-item-content',
	templateUrl: './accordion-item-content.component.html',
	styleUrls: ['./accordion-item-content.component.scss']
})
export class UiCommonAccordionItemContentComponent {
	/**
	 * data model
	 */
	public data: IAccordionItem;

	/**
	 * default
	 * @param context {@link AccordionContext}
	 */
	public constructor(public context: AccordionContext) {
		this.data = context.data;
	}

	/**
	 * on click
	 */
	public onClick() {
		if (this.data.execute) {
			this.data.execute();
		}
	}
}
