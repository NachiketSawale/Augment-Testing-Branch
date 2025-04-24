/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITimekeepingBreakEntity } from './timekeeping-break-entity.interface';
import {IReportEntity} from './report-entity.interface';

export interface IReportCompleteEntityGenerated {

/*
 * BreaksToDelete
 */
  BreaksToDelete?: ITimekeepingBreakEntity[] | null;

/*
 * BreaksToSave
 */
  BreaksToSave?: ITimekeepingBreakEntity[] | null;

/*
 * MainItemId
 */
  MainItemId: number;

/*
 * Reports
 */
  Reports?: IReportEntity | null;
}
