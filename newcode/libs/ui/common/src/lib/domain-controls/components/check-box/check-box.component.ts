/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, OnInit} from '@angular/core';
import {IControlContext} from '../../model/control-context.interface';
import {DomainControlBaseComponent} from '../domain-control-base/domain-control-base.component';

/**
 * Represents a check box.
 */
@Component({
	selector: 'ui-common-check-box',
	templateUrl: './check-box.component.html',
	styleUrls: ['./check-box.component.scss'],
})
export class CheckBoxComponent extends DomainControlBaseComponent<boolean, IControlContext<boolean>> implements OnInit {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	public ngOnInit(): void {}
}
