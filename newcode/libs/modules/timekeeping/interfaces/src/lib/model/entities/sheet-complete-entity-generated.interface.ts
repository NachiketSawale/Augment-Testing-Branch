/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReportEntity } from './report-entity.interface';
import { IReportCompleteEntity } from './report-complete-entity.interface';
import { ISheetEntity } from './sheet-entity.interface';


export interface ISheetCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * ReportsToDelete
 */
  ReportsToDelete?: IReportEntity[] | null;

/*
 * ReportsToSave
 */
  ReportsToSave?: IReportCompleteEntity[] | null;

/*
 * Sheets
 */
  Sheets?: ISheetEntity | null;
}
