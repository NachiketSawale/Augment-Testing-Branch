/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Injector, StaticProvider } from '@angular/core';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { PropertyType } from '@libs/platform/common';
import {
	ICustomComponentControlContext
} from '../../model/custom-component-control-context.interface';
import { ControlContextInjectionToken } from '../../model/control-context.interface';

/**
 * A host component for a custom control.
 */
@Component({
	selector: 'ui-common-custom-control-host',
	templateUrl: './custom-control-host.component.html',
	styleUrls: ['./custom-control-host.component.scss'],
})
export class CustomControlHostComponent extends DomainControlBaseComponent<PropertyType, ICustomComponentControlContext> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	private readonly outerInjector = inject(Injector);

	private getInjector(): Injector {
		const providers: StaticProvider[] = [{
			provide: ControlContextInjectionToken,
			useValue: this.controlContext
		}];

		if (this.controlContext.providers) {
			providers.push(...this.controlContext.providers);
		}

		return Injector.create({
			providers: providers,
			parent: this.outerInjector
		});
	}

	/**
	 * The injector to use for the custom inner component.
	 * Note: Don't property getter which would cause custom component reinitialized repeatedly.
	 */
	public injector = this.getInjector();
}
