/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ISchedulingWorkEntityGenerated extends IEntityBase, IEntityIdentification {
	Id: number;
	WeekdayFk?: number;
	WorkStart?:string;
	WorkEnd?:string;
	IsWorkingDay:boolean;
	DescriptionInfo?:IDescriptionInfo;
}
