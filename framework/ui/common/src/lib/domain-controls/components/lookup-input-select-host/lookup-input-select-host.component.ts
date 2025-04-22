/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { ILookupInputSelectControlContext } from '../../model/lookup-input-select-control-context.interface';
import { LookupFreeInputType } from '../../../../lib/lookup';

/**
 * A domain control that hosts a lookup free input component.
 */
@Component({
	selector: 'ui-common-lookup-input-select-host',
	templateUrl: './lookup-input-select-host.component.html'
})
export class LookupInputSelectHostComponent<T extends object> extends DomainControlBaseComponent<LookupFreeInputType, ILookupInputSelectControlContext<T>> {
	public constructor() {
		super();
	}
}
