/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject } from '@angular/core';
import { EXPANDABLE_DOMAIN_CONTROL_ITEM_TOKEN, ExpandableDomainControlItemConfig } from '../../../model/types/expandable-domain-control/expandable-domain-control-item-config.type';

/**
 * Used to add domain controls in accordions.
 */
@Component({
	selector: 'workflow-main-expandable-domain-control-item',
	templateUrl: './expandable-domain-control-item.component.html'
})
export class ExpandableDomainControlItemComponent<Entity extends object> {
	public constructor(@Inject(EXPANDABLE_DOMAIN_CONTROL_ITEM_TOKEN) public expandableFormFieldItem: ExpandableDomainControlItemConfig<Entity>) {}
}