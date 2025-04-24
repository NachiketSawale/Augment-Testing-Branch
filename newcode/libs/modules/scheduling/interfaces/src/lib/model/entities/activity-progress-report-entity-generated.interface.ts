/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ILineItemHeaderEntity } from './line-item-header-entity.interface';
import { ILineItemEntity } from './line-item-entity.interface';

export interface IActivityProgressReportEntityGenerated extends IEntityBase {

  /**
   * Activity2ModelObjectFk
   */
  Activity2ModelObjectFk?: number | null;

  /**
   * ActivityFk
   */
  ActivityFk?: number | null;

  /**
   * BasUomFk
   */
  BasUomFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk?: number | null;

  /**
   * EstLineItemFk
   */
  EstLineItemFk?: number | null;

  /**
   * EstimateHeaderIsActive
   */
  EstimateHeaderIsActive: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * LineItemHeaders
   */
  LineItemHeaders?: ILineItemHeaderEntity[] | null;

  /**
   * LineItems
   */
  LineItems?: ILineItemEntity[] | null;

  /**
   * PCo
   */
  PCo?: number | null;

  /**
   * PerformanceDate
   */
  PerformanceDate?: string | null;

  /**
   * PlannedQuantity
   */
  PlannedQuantity: number;

  /**
   * PlannedWork
   */
  PlannedWork: number;

  /**
   * Quantity
   */
  Quantity?: number | null;

  /**
   * QuantityTotal
   */
  QuantityTotal: number;

  /**
   * RemainingPCo
   */
  RemainingPCo?: number | null;

  /**
   * RemainingQuantity
   */
  RemainingQuantity?: number | null;

  /**
   * RemainingWork
   */
  RemainingWork?: number | null;

  /**
   * ScheduleFk
   */
  ScheduleFk: number;

  /**
   * Work
   */
  Work?: number | null;

  /**
   * WorkTotal
   */
  WorkTotal: number;
}
