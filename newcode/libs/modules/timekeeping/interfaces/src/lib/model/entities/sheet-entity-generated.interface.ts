/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReportEntity } from './report-entity.interface';
import { ITimekeepingResultEntity } from './timekeeping-result-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface ISheetEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * EmployeeFk
 */
  EmployeeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * RecordingFk
 */
  RecordingFk?: number | null;

/*
 * ReportEntities
 */
  ReportEntities?: IReportEntity[] | null;


/*
 * SheetStatusFk
 */
  SheetStatusFk?: number | null;

/*
 * SheetSymbolFk
 */
  SheetSymbolFk?: number | null;

/*
 * TimekeepingGroupId
 */
  TimekeepingGroupId?: number | null;

/*
 * TimekeepingResultEntities1
 */
  TimekeepingResultEntities1?: ITimekeepingResultEntity[] | null;
}
