/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';

export interface ISaleEntityGenerated extends IEntityBase {

/*
 * BasCurrencyFk
 */
  BasCurrencyFk: number;

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * ChancesFk
 */
  ChancesFk: number;

/*
 * ClosingDate
 */
  ClosingDate?: string | null;

/*
 * ClosingTime
 */
  ClosingTime?: string | null;

/*
 * Code
 */
  Code: string;

/*
 * DateClosed
 */
  DateClosed?: string | null;

/*
 * DecisionFk
 */
  DecisionFk: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OutcomeFk
 */
  OutcomeFk: number;

/*
 * ProfitPercent
 */
  ProfitPercent: number;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Rank
 */
  Rank: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Remark01
 */
  Remark01?: string | null;

/*
 * Remark02
 */
  Remark02?: string | null;

/*
 * Remark03
 */
  Remark03?: string | null;

/*
 * Remark04
 */
  Remark04?: string | null;

/*
 * Remark05
 */
  Remark05?: string | null;

/*
 * RemarkOutcome
 */
  RemarkOutcome?: string | null;

/*
 * StadiumFk
 */
  StadiumFk: number;

/*
 * ValuationDifference
 */
  ValuationDifference: number;

/*
 * ValuationHighest
 */
  ValuationHighest: number;

/*
 * ValuationLowest
 */
  ValuationLowest: number;

/*
 * ValuationOwn
 */
  ValuationOwn: number;

/*
 * Volume
 */
  Volume: number;
}
