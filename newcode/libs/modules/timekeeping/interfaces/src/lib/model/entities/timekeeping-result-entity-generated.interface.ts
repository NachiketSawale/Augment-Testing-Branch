/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRecordingEntity } from './recording-entity.interface';
import { ISheetEntity } from './sheet-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface ITimekeepingResultEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * Hours
 */
  Hours?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsReadOnly
 */
  IsReadOnly?: boolean | null;

/*
 * IsSuccessFinance
 */
  IsSuccessFinance?: boolean | null;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * ProjectActionFk
 */
  ProjectActionFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Rate
 */
  Rate?: number | null;

/*
 * RecordingEntity
 */
  RecordingEntity?: IRecordingEntity | null;

/*
 * RecordingEntity_RecordingFk
 */
  RecordingEntity_RecordingFk?: IRecordingEntity | null;

/*
 * RecordingFk
 */
  RecordingFk?: number | null;

/*
 * ResultStatusFk
 */
  ResultStatusFk?: number | null;

/*
 * SheetEntity
 */
  SheetEntity?: ISheetEntity | null;

/*
 * SheetEntity_SheetFk
 */
  SheetEntity_SheetFk?: ISheetEntity | null;

/*
 * SheetFk
 */
  SheetFk?: number | null;

/*
 * TimeAllocationHeaderFk
 */
  TimeAllocationHeaderFk?: number | null;

/*
 * TimeSymbolFk
 */
  TimeSymbolFk?: number | null;

/*
 * UsedForTransaction
 */
  UsedForTransaction?: boolean | null;
}
