/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITimekeepingResultEntity } from './timekeeping-result-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IRecordingEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * EmployeeFk
 */
  EmployeeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * PayrollYear
 */
  PayrollYear?: number | null;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * RecordingStatusFk
 */
  RecordingStatusFk?: number | null;

/*
 * RubricCategoryFk
 */
  RubricCategoryFk?: number | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * ShiftFk
 */
  ShiftFk?: number | null;

/*
 * TimekeepingPeriodFk
 */
  TimekeepingPeriodFk?: number | null;

/*
 * TimekeepingResultEntities
 */
  TimekeepingResultEntities?: ITimekeepingResultEntity[] | null;

/*
 * TimekeepingResultEntities_RecordingFk
 */
  TimekeepingResultEntities_RecordingFk?: ITimekeepingResultEntity[] | null;

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
}
