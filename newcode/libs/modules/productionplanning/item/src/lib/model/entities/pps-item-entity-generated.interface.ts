/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntity } from './pps-item-entity.interface';
import { IPPSItem2ClerkEntity } from './pps-item-2clerk-entity.interface';
import { IPpsItemSourceEntity } from './pps-item-source-entity.interface';
import { IEntityBase, IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IPPSItemEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * AreaSourceUomFk
 */
  AreaSourceUomFk?: number | null;

/*
 * AssignedQuantity
 */
  AssignedQuantity?: number | null;

/*
 * BoQRefNo
 */
  BoQRefNo?: string | null;

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * BusinessPartnerOrderFk
 */
  BusinessPartnerOrderFk?: number | null;

/*
 * ChildItems
 */
  ChildItems?: IPPSItemEntity[] | null;

/*
 * ClerkTecFk
 */
  ClerkTecFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DynamicClerks
 */
  DynamicClerks?: {[key: string]: number} | null;

/*
 * DynamicDateTimes
 */
  DynamicDateTimes?: {[key: string]: string} | null;

/*
 * EngDrawingDefFk
 */
  EngDrawingDefFk?: number | null;

/*
 * EngDrawingStatusFk
 */
  EngDrawingStatusFk?: number | null;

/*
 * EngTaskId
 */
  EngTaskId?: number | null;

/*
 * EngTaskPlannedFinish
 */
  EngTaskPlannedFinish?: string | null;

/*
 * EngTaskPlannedStart
 */
  EngTaskPlannedStart?: string | null;

// /*
//  * Entity2ClerkEntities
//  */
//   Entity2ClerkEntities?: IIEntity2ClerkEntity[] | null;

// /*
//  * EventEntities
//  */
//   EventEntities?: IIPpsEventEntity[] | null;

// /*
//  * EventTypeEntities
//  */
//   EventTypeEntities?: IEventTypeEntity[] | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HierarchyFilter
 */
  HierarchyFilter?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * InProduction
 */
  InProduction?: boolean | null;

/*
 * IsLeaf
 */
  IsLeaf?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsReadOnly
 */
  IsReadOnly?: boolean | null;

/*
 * IsTransportPlanned
 */
  IsTransportPlanned?: boolean | null;

/*
 * IsUpstreamDefined
 */
  IsUpstreamDefined?: string | null;

/*
 * Item2ClerkEntities
 */
  Item2ClerkEntities?: IPPSItem2ClerkEntity[] | null;

/*
 * Item2ClerkXEntities
 */
  Item2ClerkXEntities?: IPPSItem2ClerkEntity[] | null;

/*
 * ItemChildren
 */
  ItemChildren?: IPPSItemEntity[] | null;

/*
 * ItemTypeFk
 */
  ItemTypeFk?: number | null;

/*
 * JobDefFk
 */
  JobDefFk?: number | null;

/*
 * JobFilter
 */
  JobFilter?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * MaterialBlobsFk
 */
  MaterialBlobsFk?: number | null;

/*
 * MaterialGroupFk
 */
  MaterialGroupFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * OpenQuantity
 */
  OpenQuantity?: number | null;

/*
 * OrdHeaderFk
 */
  OrdHeaderFk?: number | null;

/*
 * PPSHeaderFk
 */
  PPSHeaderFk?: number | null;

/*
 * PPSItemFk
 */
  PPSItemFk?: number | null;

/*
 * PPSItemOriginFk
 */
  PPSItemOriginFk?: number | null;

/*
 * PPSItemStatusFk
 */
  PPSItemStatusFk?: number | null;

/*
 * PPSReprodReasonFk
 */
  PPSReprodReasonFk?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PpsItemSourceEntities
 */
  PpsItemSourceEntities?: IPpsItemSourceEntity[] | null;

/*
 * PrjLocationFk
 */
  PrjLocationFk?: number | null;

/*
 * ProductDescriptionCode
 */
  ProductDescriptionCode?: string | null;

/*
 * ProductDescriptionFk
 */
  ProductDescriptionFk?: number | null;

/*
 * ProductDuration
 */
  ProductDuration?: number | null;

/*
 * ProductionFinish
 */
  ProductionFinish?: string | null;

/*
 * ProductionOrder
 */
  ProductionOrder?: string | null;

/*
 * ProductionQuantity
 */
  ProductionQuantity?: number | null;

/*
 * ProductionSetId
 */
  ProductionSetId?: number | null;

/*
 * ProductionStart
 */
  ProductionStart?: string | null;

/*
 * ProductionWorkingWeek
 */
  ProductionWorkingWeek?: {[key: string]: number} | null;

/*
 * ProductsAreaSum
 */
  ProductsAreaSum?: number | null;

/*
 * ProductsBillingQtySum
 */
  ProductsBillingQtySum?: number | null;

/*
 * ProductsCount
 */
  ProductsCount?: number | null;

/*
 * ProductsPlanQtySum
 */
  ProductsPlanQtySum?: number | null;

/*
 * ProductsVolumeSum
 */
  ProductsVolumeSum?: number | null;

/*
 * ProductsWeightSum
 */
  ProductsWeightSum?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

// /*
//  * Quantities
//  */
//   Quantities?: {Quantity?: IIUomObject, ActualQuantity?: IIUomObject, RemainingQuantity?: IIUomObject, Null?: IIUomObject} | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * Reference
 */
  Reference?: string | null;

/*
 * RouteIds
 */
  RouteIds?: number[] | null;

/*
 * SiteFk
 */
  SiteFk?: number | null;

/*
 * TrsRequistionId
 */
  TrsRequistionId?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * UpstreamItemQuantity
 */
  UpstreamItemQuantity?: number | null;

/*
 * UserDefinedIcon
 */
  UserDefinedIcon?: number | null;

/*
 * Userdefined1
 */
  Userdefined1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;

/*
 * Userdefined4
 */
  Userdefined4?: string | null;

/*
 * Userdefined5
 */
  Userdefined5?: string | null;

/*
 * Userflag1
 */
  Userflag1?: boolean | null;

/*
 * Userflag2
 */
  Userflag2?: boolean | null;

/*
 * WeightSourceUomFk
 */
  WeightSourceUomFk?: number | null;
}
