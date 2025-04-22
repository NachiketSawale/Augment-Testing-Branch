/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';
import {
	UntypedDomainControlBaseComponent
} from '../untyped-domain-control-base/untyped-domain-control-base.component';
import { PropertyType } from '@libs/platform/common';
import { inject } from '@angular/core';

/**
 * The common base class for all domain controls, typed to the control context type it requires.
 */
export abstract class DomainControlBaseComponent<P extends PropertyType, TContext extends IControlContext<P>> extends UntypedDomainControlBaseComponent {

	/**
	 * Initializes a new instance.
	 * @param controlContext The control context used to create the component.
	 */
	protected constructor() {
		super();
	}

	public readonly controlContext: TContext = inject(ControlContextInjectionToken) as TContext;
}