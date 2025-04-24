/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';
import { IStringControlContext } from '../../model/string-control-context.interface';

/**
 * Represents a password input box.
 */
@Component({
	selector: 'ui-common-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.scss'],
})
export class PasswordComponent extends DomainControlBaseComponent<string, IStringControlContext<string>> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}
}
