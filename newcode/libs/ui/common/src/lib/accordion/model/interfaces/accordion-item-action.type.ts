/*
 * Copyright(c) RIB Software GmbH
 */


import { IAccordionItem } from './accordion-item.interface';
import { ConcreteMenuItem } from '../../../model/menu-list/interface/index';

/**
 * Additional settings for an accordion item action.
 */
export interface IAccordionItemActionSettings {

	/**
	 * Action handler
	 */
	execute: (item: IAccordionItem) => void;
}

/**
 * Accordion item action interface
 */
export type AccordionItemAction = ConcreteMenuItem & IAccordionItemActionSettings;
