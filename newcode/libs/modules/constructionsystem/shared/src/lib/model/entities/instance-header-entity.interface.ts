/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInstanceHeaderEntityGenerated } from './instance-header-entity-generated.interface';

export interface IInstanceHeaderEntity extends IInstanceHeaderEntityGenerated {
	/*
	 * CosToEstModeFk
	 */
	CosToEstModeFk?: number | null;

	/*
	 * IsAborted
	 */
	IsAborted?: boolean | null;

	/*
	 * Message
	 */
	Message?: string | null;
}
