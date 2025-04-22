/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';
import { IStringControlContext } from '../../model/string-control-context.interface';

/**
 * Represents an input field for a single-line string.
 */
@Component({
	selector: 'ui-common-single-line-text',
	templateUrl: './single-line-text.component.html',
	styleUrls: ['./single-line-text.component.scss'],
})
export class SingleLineTextComponent extends DomainControlBaseComponent<string, IStringControlContext<string>> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		// TODO: inject settings object with restriction RegEx?
	}
}
