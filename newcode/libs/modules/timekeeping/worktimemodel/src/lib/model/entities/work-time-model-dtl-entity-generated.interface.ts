/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWorkTimeModelEntity } from './work-time-model-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IWorkTimeModelDtlEntityGenerated extends IEntityBase {

/*
 * AccountMaxLimit
 */
  AccountMaxLimit?: number | null;

/*
 * AccountMinLimit
 */
  AccountMinLimit?: number | null;

/*
 * DailyLimit
 */
  DailyLimit?: number | null;

/*
 * DailySavingLimit
 */
  DailySavingLimit?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * LowerDailySavingLimit
 */
  LowerDailySavingLimit?: number | null;

/*
 * MonthlyLimit
 */
  MonthlyLimit?: number | null;

/*
 * MonthlySavingLimit
 */
  MonthlySavingLimit?: number | null;

/*
 * TimeSymbolAsl1Fk
 */
  TimeSymbolAsl1Fk?: number | null;

/*
 * TimeSymbolAsl2Fk
 */
  TimeSymbolAsl2Fk?: number | null;

/*
 * TimeSymbolBdl1Fk
 */
  TimeSymbolBdl1Fk?: number | null;

/*
 * TimeSymbolBdl2Fk
 */
  TimeSymbolBdl2Fk?: number | null;

/*
 * TimeSymbolBlsl1Fk
 */
  TimeSymbolBlsl1Fk?: number | null;

/*
 * TimeSymbolBlsl2Fk
 */
  TimeSymbolBlsl2Fk?: number | null;

/*
 * TimeSymbolBusl1Fk
 */
  TimeSymbolBusl1Fk?: number | null;

/*
 * TimeSymbolBusl2Fk
 */
  TimeSymbolBusl2Fk?: number | null;

/*
 * TimeSymbolLevelTimesFk
 */
  TimeSymbolLevelTimesFk?: number | null;

/*
 * TimeSymbolOml1Fk
 */
  TimeSymbolOml1Fk?: number | null;

/*
 * TimeSymbolOml2Fk
 */
  TimeSymbolOml2Fk?: number | null;

/*
 * TimeSymbolRecapBlFk
 */
  TimeSymbolRecapBlFk?: number | null;

/*
 * TimeSymbolRecapUlFk
 */
  TimeSymbolRecapUlFk?: number | null;

/*
 * UpperDailySavingLimit
 */
  UpperDailySavingLimit?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * WeeklyLimit
 */
  WeeklyLimit?: number | null;

/*
 * WeeklySavingLimit
 */
  WeeklySavingLimit?: number | null;

/*
 * WorkingTimeModelEntity
 */
  WorkingTimeModelEntity?: IWorkTimeModelEntity | null;

/*
 * WorkingTimeModelFk
 */
  WorkingTimeModelFk?: number | null;

/*
 * YearlySavingLimit
 */
  YearlySavingLimit?: number | null;
}
