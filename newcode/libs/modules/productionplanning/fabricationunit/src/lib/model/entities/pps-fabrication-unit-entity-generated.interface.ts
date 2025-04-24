/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsFabricationUnitEntityGenerated extends IEntityBase {
  ActualFinish?: string;
  ActualQuantity?: number;
  ActualStart?: string;
  BasSiteFk?: number;
  BasUomFk?: number;
  CalCalendarFk?: number;
  Code?: string;
  CommentText?: string;
  DateshiftMode?: number;
  Description?: string;
  EarliestFinish?: string;
  EarliestStart?: string;
  EventTypeFk?: number;
  ExternalCode?: string;
  Id: number;
  IsLive?: boolean;
  IsLocked?: boolean;
  LatestFinish?: string;
  LatestStart?: string;
  LgmJobFk?: number;
  MdcControllingunitFk?: number;
  PermissionObjectInfo?: string;
  PlannedFinish?: string;
  PlannedStart?: string;
  PpsEventFk?: number;
  PpsHeaderId?: number;
  PpsItemId?: number;
  PpsProdPlaceTypeFk?: number;
  PpsProductionPlaceFk?: number;
  PpsProductionSetMainFk?: number;
  PpsStrandPatternFk?: number;
  PrjLocationFk?: number;
  ProjectId?: number;
  PsdActivityFk?: number;
  Quantity?: number;
  RemainingQuantity?: number;
  UserDefined1?: string;
  UserDefined2?: string;
  UserDefined3?: string;
  UserDefined4?: string;
  UserDefined5?: string;
}
