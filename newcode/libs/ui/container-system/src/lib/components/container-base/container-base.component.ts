/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy } from '@angular/core';
import { ContainerInjectionInfo } from '../../model/container-injection-info.model';

/**
 * The base class for all containers.
 */
@Component({
	template: ''
})
export abstract class ContainerBaseComponent implements OnDestroy {

	/**
	 * Provides access to any standard elements of the container UI, such as the toolbar.
	 */
	protected readonly uiAddOns = inject(ContainerInjectionInfo.uiAddOnsInjectionToken);

	/**
	 * Provides access to the container definition for the container.
	 */
	protected readonly containerDefinition = inject(ContainerInjectionInfo.containerDefInjectionToken);

	private readonly registeredFinalizers: (() => void)[] = [];

	/**
	 * Registers a finalizer function that is run automatically when the container gets destroyed.
	 * @param finalizer The finalizer function.
	 */
	protected registerFinalizer(finalizer: () => void) {
		this.registeredFinalizers.push(finalizer);
	}

	/**
	 * Registers a subscription that is unsubscribed automatically when the container gets destroyed.
	 *
	 * @param subscription The subscription.
	 */
	protected registerSubscription(subscription: Subscription) {
		this.registerFinalizer(() => subscription.unsubscribe());
	}

	/**
	 * Is executed when the container is destroyed.
	 */
	public ngOnDestroy() {
		for (const finalizer of this.registeredFinalizers) {
			finalizer();
		}
	}
}