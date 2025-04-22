/*
 * Copyright(c) RIB Software GmbH
 */

import { InitializationContext } from '@libs/platform/common';
import { IContainerInitializationContext } from './container-initialization-context.interface';
import { Injector } from '@angular/core';

export class ContainerInitializationContext extends InitializationContext implements IContainerInitializationContext {

	/**
	 * Initializes a new instance.
	 *
	 * @param injector The Angular injector to use.
	 * @param containerUuid The UUID of the container being initialized.
	 */
	public constructor(injector: Injector, public readonly containerUuid: string) {
		super(injector);
	}
}
