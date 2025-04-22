/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { ContainerDefinition } from './container-definition.class';
import { IContainerUiAddOns } from './container-ui-add-ons.interface';

/**
 * Provides injection tokens for container resources.
 */
export const ContainerInjectionInfo = {

	/**
	 * The injection token used to inject the container UI add-ons into a container.
	 */
	uiAddOnsInjectionToken: new InjectionToken<IContainerUiAddOns>('containerUiAddOns'),

	/**
	 * The injection token used to inject the container definition into a container.
	 */
	containerDefInjectionToken: new InjectionToken<ContainerDefinition >('containerDef')
} as const;