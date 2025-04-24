/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ILineItemProgressEntityGenerated extends IEntityBase {

/*
 * ActivityCode
 */
  ActivityCode?: string | null;

/*
 * ActivityDescription
 */
  ActivityDescription?: string | null;

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * CostTotal
 */
  CostTotal?: number | null;

/*
 * DueDateQuantityPerformance
 */
  DueDateQuantityPerformance?: number | null;

/*
 * DueDateWorkPerformance
 */
  DueDateWorkPerformance?: number | null;

/*
 * EstimationCode
 */
  EstimationCode?: string | null;

/*
 * EstimationDescription
 */
  EstimationDescription?: IDescriptionInfo | null;

/*
 * EstimationHeaderFk
 */
  EstimationHeaderFk?: number | null;

/*
 * ExternalCode
 */
  ExternalCode?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * LineItemCode
 */
  LineItemCode?: string | null;

/*
 * LineItemDescription
 */
  LineItemDescription?: IDescriptionInfo | null;

/*
 * LineItemFk
 */
  LineItemFk?: number | null;

/*
 * PCo
 */
  PCo?: number | null;

/*
 * PeriodQuantityPerformance
 */
  PeriodQuantityPerformance?: number | null;

/*
 * PeriodWorkPerformance
 */
  PeriodWorkPerformance?: number | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * ProgressReportMethodFk
 */
  ProgressReportMethodFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * RemainingLineItemQuantity
 */
  RemainingLineItemQuantity?: number | null;

/*
 * RemainingLineItemWork
 */
  RemainingLineItemWork?: number | null;

/*
 * UoMFk
 */
  UoMFk?: number | null;

/*
 * Work
 */
  Work?: number | null;
}
