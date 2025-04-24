/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ISheetEntity} from './sheet-entity.interface';
import { IRecordingEntity } from './recording-entity.interface';
import { ITimekeepingBreakEntity } from './timekeeping-break-entity.interface';

import { IEntityBase } from '@libs/platform/common';
import { IEmployeeEntity } from '../model';

export interface IReportEntityGenerated extends IEntityBase {

/*
 * BreakDuration
 */
  BreakDuration?: number | null;

/*
 * BreakFrom
 */
  BreakFrom?: string | null;

/*
 * BreakTo
 */
  BreakTo?: string | null;

/*
 * BreaksToDelete
 */
  BreaksToDelete?: ITimekeepingBreakEntity[] | null;

/*
 * BreaksToSave
 */
  BreaksToSave?: ITimekeepingBreakEntity[] | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * Duration
 */
  Duration?: number | null;

/*
 * Employee
 */
  Employee?: IEmployeeEntity | null;

/*
 * EmployeeFk
 */
  EmployeeFk?: number | null;

/*
 * From
 */
  From?: string | null;

/*
 * FromCalculated
 */
  FromCalculated?: string | null;

/*
 * FromTimeBreakDate
 */
  FromTimeBreakDate?: string | null;

/*
 * FromTimeBreakTime
 */
  FromTimeBreakTime?: string | null;

/*
 * FromTimePartDate
 */
  FromTimePartDate?: string | null;

/*
 * FromTimePartTime
 */
  FromTimePartTime?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBreaksAvailable
 */
  IsBreaksAvailable?: boolean | null;

/*
 * IsGenerated
 */
  IsGenerated?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsModified
 */
  IsModified?: boolean | null;

/*
 * IsOnlyOneBreak
 */
  IsOnlyOneBreak?: boolean | null;

/*
 * IsReadOnly
 */
  IsReadOnly?: boolean | null;

/*
 * IsSuccessFinance
 */
  IsSuccessFinance?: boolean | null;

/*
 * ItwositeId
 */
  ItwositeId?: number | null;

/*
 * JobFk
 */
  JobFk?: number | null;

	/**
	 * Latitude
	 */
	Latitude?: number | null;

	/**
	 * Longitude
	 */
	Longitude?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * ProjectActionFk
 */
  ProjectActionFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * RecordingFk
 */
  RecordingFk?: number | null;

/*
 * ReportHeader
 */
  ReportHeader?: IRecordingEntity | null;

/*
 * ReportStatusFk
 */
  ReportStatusFk?: number | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Sheet
 */
  Sheet?: ISheetEntity | null;

/*
 * SheetEntity
 */
  SheetEntity?: ISheetEntity | null;

/*
 * SheetFk
 */
  SheetFk?: number | null;

/*
 * TimeSymbolFk
 */
  TimeSymbolFk?: number | null;

/*
 * TimekeepingGroupId
 */
  TimekeepingGroupId?: number | null;

/*
 * To
 */
  To?: string | null;

/*
 * ToCalculated
 */
  ToCalculated?: string | null;

/*
 * ToTimeBreakDate
 */
  ToTimeBreakDate?: string | null;

/*
 * ToTimeBreakTime
 */
  ToTimeBreakTime?: string | null;

/*
 * ToTimePartDate
 */
  ToTimePartDate?: string | null;

/*
 * ToTimePartTime
 */
  ToTimePartTime?: string | null;

/*
 * UsedForTransaction
 */
  UsedForTransaction?: boolean | null;

/*
 * UserDefinedDate01
 */
  UserDefinedDate01?: string | null;

/*
 * UserDefinedDate02
 */
  UserDefinedDate02?: string | null;

/*
 * UserDefinedDate03
 */
  UserDefinedDate03?: string | null;

/*
 * UserDefinedDate04
 */
  UserDefinedDate04?: string | null;

/*
 * UserDefinedDate05
 */
  UserDefinedDate05?: string | null;

/*
 * UserDefinedDate06
 */
  UserDefinedDate06?: string | null;

/*
 * UserDefinedDate07
 */
  UserDefinedDate07?: string | null;

/*
 * UserDefinedDate08
 */
  UserDefinedDate08?: string | null;

/*
 * UserDefinedDate09
 */
  UserDefinedDate09?: string | null;

/*
 * UserDefinedDate10
 */
  UserDefinedDate10?: string | null;

/*
 * UserDefinedNumber01
 */
  UserDefinedNumber01?: number | null;

/*
 * UserDefinedNumber02
 */
  UserDefinedNumber02?: number | null;

/*
 * UserDefinedNumber03
 */
  UserDefinedNumber03?: number | null;

/*
 * UserDefinedNumber04
 */
  UserDefinedNumber04?: number | null;

/*
 * UserDefinedNumber05
 */
  UserDefinedNumber05?: number | null;

/*
 * UserDefinedNumber06
 */
  UserDefinedNumber06?: number | null;

/*
 * UserDefinedNumber07
 */
  UserDefinedNumber07?: number | null;

/*
 * UserDefinedNumber08
 */
  UserDefinedNumber08?: number | null;

/*
 * UserDefinedNumber09
 */
  UserDefinedNumber09?: number | null;

/*
 * UserDefinedNumber10
 */
  UserDefinedNumber10?: number | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;

/*
 * UserDefinedText06
 */
  UserDefinedText06?: string | null;

/*
 * UserDefinedText07
 */
  UserDefinedText07?: string | null;

/*
 * UserDefinedText08
 */
  UserDefinedText08?: string | null;

/*
 * UserDefinedText09
 */
  UserDefinedText09?: string | null;

/*
 * UserDefinedText10
 */
  UserDefinedText10?: string | null;

/*
 * Weekday
 */
  Weekday?: string | null;

/*
 * WorkingTimeModelFk
 */
  WorkingTimeModelFk?: number | null;
}
