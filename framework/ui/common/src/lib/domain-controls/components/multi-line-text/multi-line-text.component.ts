/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';
import { IStringControlContext } from '../../model/string-control-context.interface';

/**
 * Represents an input field for a multi-line string.
 */
@Component({
	selector: 'ui-common-multi-line-text',
	templateUrl: './multi-line-text.component.html',
	styleUrls: ['./multi-line-text.component.scss'],
})
export class MultiLineTextComponent extends DomainControlBaseComponent<string, IStringControlContext<string>> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}
}
