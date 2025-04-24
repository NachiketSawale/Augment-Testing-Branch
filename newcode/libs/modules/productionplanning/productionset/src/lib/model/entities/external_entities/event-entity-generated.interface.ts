/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IItem2EventEntity } from './item-2event-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEventEntityGenerated extends IEntityBase {

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * BasUomFk
 */
  BasUomFk: number;

/*
 * CalCalendarFk
 */
  CalCalendarFk: number;

/*
 * DateshiftMode
 */
  DateshiftMode: number;

/*
 * DisplayTxt
 */
  DisplayTxt?: string | null;

/*
 * EarliestFinish
 */
  EarliestFinish?: string | null;

/*
 * EarliestStart
 */
  EarliestStart?: string | null;

/*
 * EventCode
 */
  EventCode?: string | null;

/*
 * EventTypeFk
 */
  EventTypeFk: number;

/*
 * HasWriteRight
 */
  HasWriteRight?: boolean | null;

/*
 * HeaderFk
 */
  HeaderFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsHidden
 */
  IsHidden?: boolean | null;

/*
 * IsLeaf
 */
  IsLeaf: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * IsLocked
 */
  IsLocked: boolean;

/*
 * IsLockedFinishVirtual
 */
  IsLockedFinishVirtual?: boolean | null;

/*
 * IsLockedStartVirtual
 */
  IsLockedStartVirtual?: boolean | null;

/*
 * IsSizeLocked
 */
  IsSizeLocked?: boolean | null;

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
 * ModificationInfo
 */
//   ModificationInfo?: IModificationInfo | null;

/*
 * MultishiftType
 */
  MultishiftType?: string | null;

/*
 * OrdHeaderFk
 */
  OrdHeaderFk?: number | null;

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
 * PpsItem2eventEntities
 */
  PpsItem2eventEntities?: IItem2EventEntity[] | null;

/*
 * PrjLocationFk
 */
  PrjLocationFk?: number | null;

/*
 * ProductDescriptionFk
 */
  ProductDescriptionFk?: number | null;

/*
 * ProductFk
 */
  ProductFk?: number | null;

/*
 * ProductionSetFk
 */
  ProductionSetFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * PsdActivityFk
 */
  PsdActivityFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * SequenceOrder
 */
  SequenceOrder?: number | null;

/*
 * TrsPackageFk
 */
  TrsPackageFk?: number | null;

/*
 * TrsProductBundleFk
 */
  TrsProductBundleFk?: number | null;

/*
 * Userflag1
 */
  Userflag1: boolean;

/*
 * Userflag2
 */
  Userflag2: boolean;
}
