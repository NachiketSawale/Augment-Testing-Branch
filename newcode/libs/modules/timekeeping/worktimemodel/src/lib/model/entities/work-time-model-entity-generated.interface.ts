/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITimeSymbol2WorkTimeModelEntity } from './time-symbol-2work-time-model-entity.interface';
import { IWorkTimeDerivationEntity } from './work-time-derivation-entity.interface';
import { IWorkTimeModelDayEntity } from './work-time-model-day-entity.interface';
import { IWorkTimeModelDtlEntity } from './work-time-model-dtl-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IWorkTimeModelEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsFallback
 */
  IsFallback?: boolean | null;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * Isstatussensitive
 */
  Isstatussensitive?: boolean | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * TimeSheetContextFk
 */
  TimeSheetContextFk?: number | null;

/*
 * TksTimesymb2worktimemdlEntities
 */
  TksTimesymb2worktimemdlEntities?: ITimeSymbol2WorkTimeModelEntity[] | null;

/*
 * VactionExpiryDate
 */
  VactionExpiryDate?: string | null;

/*
 * VactionYearStart
 */
  VactionYearStart?: string | null;

/*
 * WeekEndsOn
 */
  WeekEndsOn?: number | null;

/*
 * WorkingTimeDerivationEntities
 */
  WorkingTimeDerivationEntities?: IWorkTimeDerivationEntity[] | null;

/*
 * WorkingTimeModelDayEntities
 */
  WorkingTimeModelDayEntities?: IWorkTimeModelDayEntity[] | null;

/*
 * WorkingTimeModelDtlEntities
 */
  WorkingTimeModelDtlEntities?: IWorkTimeModelDtlEntity[] | null;

/*
 * WorkingTimeModelFbFk
 */
  WorkingTimeModelFbFk?: number | null;
}
