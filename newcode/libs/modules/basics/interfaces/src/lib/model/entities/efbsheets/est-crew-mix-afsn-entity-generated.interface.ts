/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IBasicsEfbsheetsEntity } from './basics-efbsheets-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IEstCrewMixAfsnEntityGenerated extends IEntityBase {

/*
 * EstCrewMixEntity
 */
  EstCrewMixEntity?: IBasicsEfbsheetsEntity | null;

/*
 * EstCrewMixFk
 */
  EstCrewMixFk?: number | null;

/*
 * Expensives
 */
  Expensives?: number | null;

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
 * PercentSurcharge
 */
  PercentSurcharge?: number | null;

/*
 * RateHour
 */
  RateHour?: number | null;
}
