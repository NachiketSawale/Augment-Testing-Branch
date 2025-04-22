/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';

/**
 * Provides context information during the phase when a container is being initialized.
 */
export interface IContainerInitializationContext extends IInitializationContext {

	/**
	 * The UUID of the container being initialized.
	 */
	readonly containerUuid: string;
}
