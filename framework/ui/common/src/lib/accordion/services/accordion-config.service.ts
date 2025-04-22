/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IAccordionConfig } from '../model/interfaces/accordion-config.interface';
import { UiCommonAccordionItemContentComponent } from '../components/accordion-item-content/accordion-item-content.component';

/**
 * Global accordion config service
 */
@Injectable({
	providedIn: 'root'
})
export class AccordionConfigService implements IAccordionConfig {
	/**
	 * default true
	 */
	public multi = true;
	/**
	 * default item component
	 */
	public itemComponent = UiCommonAccordionItemContentComponent;
	/**
	 * default row
	 */
	public actionButtonDirection = 'row';
}
