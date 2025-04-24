/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject } from '@angular/core';
import { IAccordionItem } from '@libs/ui/common';
import { EXPANDABLE_DOMAIN_CONTROL_PARENT_TOKEN, ExpandableDomainControlParentConfig } from '../../../model/types/expandable-domain-control/expandable-domain-control-parent-config.type';
import { ExpandableDomainControlItemComponent } from '../expandable-domain-control-item/expandable-domain-control-item.component';
import { EXPANDABLE_DOMAIN_CONTROL_ITEM_TOKEN } from '../../../model/types/expandable-domain-control/expandable-domain-control-item-config.type';

/**
 * Used to add accordion in form field.
 */
@Component({
	selector: 'workflow-main-expandable-domain-control-parent',
	templateUrl: './expandable-domain-control-parent.component.html'
})
export class ExpandableDomainControlParentComponent<Entity extends object> {

	private groupExpansionState: Record<string | number, boolean> = {};

	public constructor(@Inject(EXPANDABLE_DOMAIN_CONTROL_PARENT_TOKEN) expandableDomainControlParent: ExpandableDomainControlParentConfig<Entity>) {
		this.groups.push({
			id: expandableDomainControlParent.groupId,
			title: expandableDomainControlParent.header ?? '',
			expanded: this.groupExpansionState[expandableDomainControlParent.groupId] ?? expandableDomainControlParent.open,
			children: [{
				id: 'expandable-domain-control',
				component: ExpandableDomainControlItemComponent,
				providers: [{
					provide: EXPANDABLE_DOMAIN_CONTROL_ITEM_TOKEN,
					useValue: expandableDomainControlParent.item
				}]
			}]
		});
	}

	public groups: IAccordionItem[] = [];

	/**
	 * Reacts to the expansion event of a collapsible group.
	 *
	 * @param item The accordion item representing the group that was expanded.
	 */
	public groupExpanded(item: IAccordionItem) {
		this.groupExpansionState[item.id] = true;
	}

	/**
	 * Reacts to the collapsation of a collapsible group.
	 *
	 * @param item The accordion item representing the group that was collapsed.
	 */
	public groupCollapsed(item: IAccordionItem) {
		this.groupExpansionState[item.id] = false;
	}

}