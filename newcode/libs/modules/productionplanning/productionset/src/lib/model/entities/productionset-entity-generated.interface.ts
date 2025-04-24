/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IProductionsetEntityGenerated extends IEntityBase {

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualQuantity
 */
  ActualQuantity?: number | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * CalCalendarFk
 */
  CalCalendarFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DateshiftMode
 */
  DateshiftMode?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DynamicDateTimes
 */
  DynamicDateTimes?: {[key: string]: string} | null;

/*
 * EarliestFinish
 */
  EarliestFinish?: string | null;

/*
 * EarliestStart
 */
  EarliestStart?: string | null;

/*
 * EventEntities
 */
//  EventEntities?:IPpsEventEntity[] | null;

/*
 * EventTypeFk
 */
  EventTypeFk?: number | null;

/*
 * Id
 */
  Id: number;
  /*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsLocked
 */
  IsLocked?: boolean | null;

/*
 * IsUserEditedValue
 */
  IsUserEditedValue?: boolean | null;

/*
 * ItemFk
 */
  ItemFk?: number | null;

/*
 * LatestFinish
 */
  LatestFinish?: string | null;

/*
 * LatestStart
 */
  LatestStart?: string | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * MdcControllingunitFk
 */
  MdcControllingunitFk?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * PpsEventFk
 */
  PpsEventFk?: number | null;

/*
 * PpsProdSetStatusFk
 */
  PpsProdSetStatusFk?: number | null;

/*
 * PrjLocationFk
 */
  PrjLocationFk?: number | null;

/*
 * ProductionSetParentFk
 */
  ProductionSetParentFk?: number | null;

/*
 * ProductionSiteFk
 */
  ProductionSiteFk?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * PsdActivityFk
 */
  PsdActivityFk?: number | null;

/*
 * Quantities
 */
  //Quantities?: {Quantity?: IIUomObject, ActualQuantity?: IIUomObject, RemainingQuantity?: IIUomObject, Null?: IIUomObject} | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * RemainingQuantity
 */
  RemainingQuantity?: number | null;

/*
 * SiteFk
 */
  SiteFk?: number | null;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;
}
