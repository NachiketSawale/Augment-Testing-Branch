import { Component, Input } from '@angular/core';
import {
	IMenuItemsList,
	isParentMenuItem
} from '../../../model/menu-list/interface/index';

import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';
import { AccordionItemAction } from '../../model/interfaces/accordion-item-action.type';

@Component({
	selector: 'ui-common-accordion-item-actions',
	templateUrl: './accordion-item-actions.component.html',
	styleUrls: ['./accordion-item-actions.component.scss'],
})
export class UiCommonAccordionItemActionsComponent {
	/**
	 * Menu list config
	 */
	public menu!: IMenuItemsList;

	/**
	 * data model
	 */
	@Input()
	public data!: IAccordionItem;

	/**
	 * action buttons
	 */
	@Input()
	public set actionButtons(value: AccordionItemAction[]) {
		const list: IMenuItemsList = {
			cssClass: '',
			items: value,
			showImages: false,
			showTitles: false,
			activeValue: '',
			overflow: false,
			iconClass: '',
			layoutChangeable: false,
		};

		this.setActions(list);

		this.menu = list;
	}

	private setActions(list: IMenuItemsList) {
		if (!list.items) {
			return;
		}

		list.items.forEach(item => {
			const action = item as AccordionItemAction;

			if (action.execute) {
				item.fn = () => {
					action.execute(this.data);
				};
			}

			if (isParentMenuItem(item)) {
				if (item.list) {
					this.setActions(item.list);
				}
			}
		});
	}
}
