/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { IDynamicControlContext } from '../../model/dynamic-control-context.interface';
import { IControlContext } from '../../model/control-context.interface';
import { ConcreteFieldOverload, FieldType, AdditionalOptions } from '../../../model/fields';
import { DomainControlHostComponent } from '../domain-control-host/domain-control-host.component';

/**
 * Dynamic domain control
 */
@Component({
	selector: 'ui-common-dynamic-domain-control',
	templateUrl: './dynamic-domain-control.component.html',
	styleUrl: './dynamic-domain-control.component.scss',
})
export class DynamicDomainControlComponent<T extends object> extends DomainControlBaseComponent<PropertyType, IDynamicControlContext<T>> implements OnInit, OnDestroy {
	private overloadSubscription?: Subscription;

	@ViewChild(DomainControlHostComponent)
	private controlHost?: DomainControlHostComponent<T>;

	/**
	 * Current domain control
	 */
	public currentControl?: {
		fieldType?: FieldType;
		controlContext?: IControlContext;
		options?: AdditionalOptions<object>;
	};

	public constructor() {
		super();
	}

	public ngOnInit() {
		this.overloadSubscription = this.controlContext.overload(this.controlContext.entityContext).subscribe((e) => {
			this.updateCurrentControl(e);
		});
	}

	public ngOnDestroy() {
		this.unsubscribeOverloadSubscription();
	}

	/**
	 * Important! Additional options need to be copied into control context
	 * Not sure if domain framework could provide a common reusable interface to update control context while overload is changed.
	 * @param overload
	 * @private
	 */
	private updateCurrentControl(overload: ConcreteFieldOverload<T>) {
		// update domain control options first when switching field type dynamically
		// fix the error that control options is not updated when new control is rendering caused by field type change
		if (this.controlHost) {
			this.controlHost.options = overload as AdditionalOptions<object>;
		}

		this.currentControl = {
			fieldType: overload.type,
			controlContext: this.controlContext,
			options: overload as AdditionalOptions<object>,
		};
	}

	private unsubscribeOverloadSubscription() {
		this.overloadSubscription?.unsubscribe();
	}
}
