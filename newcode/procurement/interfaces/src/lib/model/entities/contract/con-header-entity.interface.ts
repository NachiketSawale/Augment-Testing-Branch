/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntityGenerated } from './con-header-entity-generated.interface';


export interface IConHeaderEntity extends IConHeaderEntityGenerated {
	packagePlannedStart: Date;
	packagePlannedEnd: Date;
	Selected?: boolean;
}
