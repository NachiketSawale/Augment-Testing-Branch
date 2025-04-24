/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData, IInitializationContext } from '@libs/platform/common';

export interface IBasicsSyncBim360DataOptions {
	/**
	 * Characteristic data typed entity info.
	 */
	initContext: IInitializationContext;
	/**
	 * Call back function after data applied.
	 * Note: it is expected to refresh and select the provide entity id if it was provided and can be found.
	 */
	afterSynchronized?: (toSelect: IIdentificationData[], projectId?: number) => Promise<void>;
}
