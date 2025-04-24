/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IActivity2ModelObjectEntityGenerated extends IEntityBase {

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * ActualDuration
 */
  ActualDuration?: number | null;

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualSequence
 */
  ActualSequence?: number | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * CurrentDuration
 */
  CurrentDuration?: number | null;

/*
 * CurrentFinish
 */
  CurrentFinish?: string | null;

/*
 * CurrentStart
 */
  CurrentStart?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderCode
 */
  EstHeaderCode?: string | null;

/*
 * EstHeaderDesc
 */
  EstHeaderDesc?: string | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemCode
 */
  EstLineItemCode?: string | null;

/*
 * EstLineItemDescription
 */
  EstLineItemDescription?: string | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * ExecutionFinished
 */
  ExecutionFinished?: boolean | null;

/*
 * ExecutionStarted
 */
  ExecutionStarted?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * LineItem2ObjectFk
 */
  LineItem2ObjectFk?: number | null;

/*
 * MdlModelFk
 */
  MdlModelFk?: number | null;

/*
 * ObjectFk
 */
  ObjectFk?: number | null;

/*
 * PCo
 */
  PCo?: number | null;

/*
 * PerformanceDate
 */
  PerformanceDate?: string | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedQuantity
 */
  PlannedQuantity?: number | null;

/*
 * PlannedSequence
 */
  PlannedSequence?: number | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * PlannedWork
 */
  PlannedWork?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * RemainingPCo
 */
  RemainingPCo?: number | null;

/*
 * RemainingQuantity
 */
  RemainingQuantity?: number | null;

/*
 * RemainingWork
 */
  RemainingWork?: number | null;

/*
 * Work
 */
  Work?: number | null;
}
