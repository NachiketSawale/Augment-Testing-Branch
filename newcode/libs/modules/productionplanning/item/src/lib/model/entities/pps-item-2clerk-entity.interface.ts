/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItem2ClerkEntityGenerated } from './pps-item-2clerk-entity-generated.interface';

export interface IPPSItem2ClerkEntity extends IPPSItem2ClerkEntityGenerated {
	From?: string;
	EngTaskFk?: number;
	EngTaskPlannedFinish?: string;
	EngTaskPlannedStart?: string;
	//   ModificationInfo?: IModificationInfo | null;
}
