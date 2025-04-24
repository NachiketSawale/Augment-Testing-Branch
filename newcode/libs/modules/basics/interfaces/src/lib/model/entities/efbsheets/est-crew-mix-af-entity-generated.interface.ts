/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IBasicsEfbsheetsEntity } from './basics-efbsheets-entity.interface';

export interface IEstCrewMixAfEntityGenerated extends IEntityBase {

/*
 * EstCrewMixEntity
 */
  EstCrewMixEntity?: IBasicsEfbsheetsEntity | null;

/*
 * EstCrewMixFk
 */
  EstCrewMixFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MarkupRate
 */
  MarkupRate?: number | null;

/*
 * MdcWageGroupFk
 */
  MdcWageGroupFk?: number | null;

/*
 * PercentHour
 */
  PercentHour?: number | null;

/*
 * PercentSurcharge
 */
  PercentSurcharge?: number | null;

/*
 * RateHour
 */
  RateHour?: number | null;
}
