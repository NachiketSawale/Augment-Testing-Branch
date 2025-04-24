/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEngType2PpsEventTypeEntityGenerated extends IEntityBase {

	/*
	 * EngTypeFk
	 */
	EngTypeFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PpsEventTypeFk
	 */
	PpsEventTypeFk?: number | null;
}
