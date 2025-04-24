/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsDailyProductionVEntity } from './pps-daily-production-ventity.interface';

export interface IPpsDailyProductionVEntityGenerated {

/*
 * ChildItems
 */
  ChildItems?: IPpsDailyProductionVEntity[] | null;

/*
 * DataType
 */
  DataType?: string | null;

/*
 * DataTypeId
 */
  DataTypeId?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Difference
 */
  Difference?: number | null;

/*
 * FullyCovered
 */
  FullyCovered?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsAssigned
 */
  IsAssigned?: boolean | null;

/*
 * ItemFk
 */
  ItemFk?: number | null;

/*
 * ParentFk
 */
  ParentFk?: number | null;

/*
 * PlanQty
 */
  PlanQty?: number | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * ProductionSetId
 */
  ProductionSetId?: number | null;

/*
 * RealQty
 */
  RealQty?: number | null;

/*
 * RootSetFk
 */
  RootSetFk?: number | null;

/*
 * SiteFk
 */
  SiteFk?: number | null;

/*
 * State
 */
  State?: number | null;

/*
 * Supplier
 */
  Supplier?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
