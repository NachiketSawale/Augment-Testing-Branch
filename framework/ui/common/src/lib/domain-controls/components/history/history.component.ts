/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';
import { IControlContext } from '../../model/control-context.interface';

/**
 * Represents a field to display history information.
 */
@Component({
	selector: 'ui-common-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
})
export class HistoryComponent extends DomainControlBaseComponent<string, IControlContext<string>> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}
}
