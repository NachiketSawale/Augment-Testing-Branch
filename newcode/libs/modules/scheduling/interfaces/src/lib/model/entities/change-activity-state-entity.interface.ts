/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IChangeActivityStateEntityGenerated } from './change-activity-state-entity-generated.interface';

export interface IChangeActivityStateEntity extends IChangeActivityStateEntityGenerated {
	Sorting?: number | null;
	Description?: string | null;
	Icon?: number | null;
}
