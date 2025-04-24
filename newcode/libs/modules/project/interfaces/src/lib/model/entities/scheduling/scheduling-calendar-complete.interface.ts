/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISchedulingCalendarEntity } from './scheduling-calendar-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IProjectStockEntity } from '../stock';

export interface ISchedulingCalendarComplete extends CompleteIdentification<IProjectStockEntity>{
	 MainItemId: number;
	 Calendars: ISchedulingCalendarEntity[];
}

