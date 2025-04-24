/*
 * Copyright(c) RIB Software GmbH
 */

import { IDdTempIdsEntity } from './dd-temp-ids-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ITrsRouteEntityGenerated extends IEntityBase {

  /**
   * ActualDelivery
   */
  ActualDelivery?: string | null;

  /**
   * ActualFinish
   */
  ActualFinish?: string | null;

  /**
   * ActualStart
   */
  ActualStart?: string | null;

  /**
   * ActualTruckTypeFk
   */
  ActualTruckTypeFk?: number | null;

  /**
   * AlternateTruckTypeFk
   */
  AlternateTruckTypeFk?: number | null;

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * BasUomWeightFk
   */
  BasUomWeightFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * CalCalendarFk
   */
  CalCalendarFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyId
   */
  CompanyId: number;

  /**
   * ContactTelephone
   */
  ContactTelephone?: string | null;

  /**
   * CopiedFromRouteId
   */
  CopiedFromRouteId?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DateshiftMode
   */
  DateshiftMode: number;

  /**
   * DdTempIdsEntities
   */
  DdTempIdsEntities?: IDdTempIdsEntity[] | null;

  /**
   * DefJob
   */
  DefJob?: string | null;

  /**
   * DefProjectName
   */
  DefProjectName?: string | null;

  /**
   * DefProjectNo
   */
  DefProjectNo?: string | null;

  /**
   * DefSrcWaypointJobFk
   */
  DefSrcWaypointJobFk: number;

  /**
   * DeliveryAddressContactFk
   */
  DeliveryAddressContactFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DriverFk
   */
  DriverFk?: number | null;

  /**
   * DriverReqId
   */
  DriverReqId: number;

  /**
   * DynamicClerks
   */
  DynamicClerks?: {[key: string]: number} | null;

  /**
   * EarliestFinish
   */
  EarliestFinish?: string | null;

  /**
   * EarliestStart
   */
  EarliestStart?: string | null;

  /**
   * Entity2ClerkEntities
   */
 // Entity2ClerkEntities?: IIEntity2ClerkEntity[] | null;

  /**
   * EventTypeFk
   */
  EventTypeFk: number;

  /**
   * GoodIsCancelled
   */
  GoodIsCancelled: boolean;

  /**
   * HasDefaultDstWaypoint
   */
  HasDefaultDstWaypoint: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsLocked
   */
  IsLocked: boolean;

  /**
   * JobDefFk
   */
  JobDefFk?: number | null;

  /**
   * JobDeliveryAddressRemark
   */
  JobDeliveryAddressRemark?: string | null;

  /**
   * LatestFinish
   */
  LatestFinish?: string | null;

  /**
   * LatestStart
   */
  LatestStart?: string | null;

  /**
   * LgmJobFk
   */
  LgmJobFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PlannedDelivery
   */
  PlannedDelivery?: string | null;

  /**
   * PlannedFinish
   */
  PlannedFinish?: string | null;

  /**
   * PlannedStart
   */
  PlannedStart?: string | null;

  /**
   * PpsEventFk
   */
  PpsEventFk: number;

  /**
   * PrjLocationFk
   */
  PrjLocationFk?: number | null;

  /**
   * ProjectDefFk
   */
  ProjectDefFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ProjectNo
   */
  ProjectNo?: string | null;

  /**
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /**
   * Quantity
   */
  Quantity?: number | null;

  /**
   * SiteFk
   */
  SiteFk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SumActualDistance
   */
  SumActualDistance: number;

  /**
   * SumBundlesInfo
   */
  SumBundlesInfo?: string | null;

  /**
   * SumDistance
   */
  SumDistance: number;

  /**
   * SumExpenses
   */
  SumExpenses: number;

  /**
   * SumPackagesWeight
   */
  SumPackagesWeight?: number | null;

  /**
   * SumProductsActualWeight
   */
  SumProductsActualWeight: number;

  /**
   * Summary
   */
  Summary?: string | null;

  /**
   * TrsRequisitionFk
   */
  TrsRequisitionFk?: number | null;

  /**
   * TrsRteStatusFk
   */
  TrsRteStatusFk: number;

  /**
   * TruckFk
   */
  TruckFk?: number | null;

  /**
   * TruckReqId
   */
  TruckReqId: number;

  /**
   * TruckTypeFk
   */
  TruckTypeFk?: number | null;

  /**
   * TruckTypeReqId
   */
  TruckTypeReqId: number;

  /**
   * UomFk
   */
  UomFk?: number | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * Userdefined6
   */
  Userdefined6?: string | null;

  /**
   * Userdefined7
   */
  Userdefined7?: string | null;

  /**
   * Userdefined8
   */
  Userdefined8?: string | null;

  /**
   * Userdefined9
   */
  Userdefined9?: string | null;
}
