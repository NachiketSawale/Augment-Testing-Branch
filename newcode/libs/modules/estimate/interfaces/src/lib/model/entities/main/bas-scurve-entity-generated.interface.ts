/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstEscalationDailyFractionResultsEntity } from './est-escalation-daily-fraction-results-entity.interface';
import { IEstEscalationScurveResultsEntity } from './est-escalation-scurve-results-entity.interface';
import { IBasScurveDetailEntity } from './bas-scurve-detail-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBasScurveEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstEscalationDailyFractionEntities
 */
  EstEscalationDailyFractionEntities?: IEstEscalationDailyFractionResultsEntity[] | null;

/*
 * EstEscalationScurveResultsEntities
 */
  EstEscalationScurveResultsEntities?: IEstEscalationScurveResultsEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * PaymentDelay
 */
  PaymentDelay?: number | null;

/*
 * ScurvedetailEntities
 */
  ScurvedetailEntities?: IBasScurveDetailEntity[] | null;

/*
 * SortBy
 */
  SortBy?: number | null;

/*
 * TotalType
 */
  TotalType?: string | null;
}
