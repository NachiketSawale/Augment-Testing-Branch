/*
 * Copyright(c) RIB Software GmbH
 */

import { IProductCollectionInfoEntity } from './product-collection-info-entity.interface';
import { IPuInfo } from './pu-info.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBundleEntityGenerated extends IEntityBase {

/*
 * AreaSourceUomFk
 */
  AreaSourceUomFk?: number | null;

/*
 * BasUomHeightFk
 */
  BasUomHeightFk?: number | null;

/*
 * BasUomLengthFk
 */
  BasUomLengthFk?: number | null;

/*
 * BasUomWeightFk
 */
  BasUomWeightFk?: number | null;

/*
 * BasUomWidthFk
 */
  BasUomWidthFk?: number | null;

/*
 * CanAssign
 */
  CanAssign?: boolean | null;

/*
 * CannotAssignReason
 */
  CannotAssignReason?: string | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * DefaultJobFk
 */
  DefaultJobFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DrawingCodeOfStack
 */
  DrawingCodeOfStack?: string | null;

/*
 * DrawingDescriptionOfStack
 */
  DrawingDescriptionOfStack?: string | null;

/*
 * DrawingFkOfStack
 */
  DrawingFkOfStack?: number | null;

/*
 * DynamicDateTimes
 */
  DynamicDateTimes?: {[key: string]: string} | null;

/*
 * EngStackFk
 */
  EngStackFk?: number | null;

/*
 * EventEntities
 */
 //EventEntities?: IIPpsEventEntity[] | null;

/*
 * Height
 */
  Height?: number | null;

/*
 * Id
 */
Id: number;

/*
 * IsCancelled
 */
  IsCancelled?: boolean | null;

/*
 * IsCreated
 */
  IsCreated?: boolean | null;

/*
 * IsDeleted
 */
  IsDeleted?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * ItemEventEntities
 */
  //ItemEventEntities?: IIPpsEventEntity[] | null;

/*
 * ItemFk
 */
  ItemFk?: number | null;

/*
 * Length
 */
  Length?: number | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * LoadingDevice
 */
  //LoadingDevice?: IIIdentifyable | null;

/*
 * OnTime
 */
  OnTime?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PlanningState
 */
  PlanningState?: number | null;

/*
 * PpsLayoutDrawingDocument
 */
  //PpsLayoutDrawingDocument?: IIIdentifyable | null;

/*
 * PpsPositionPlanDocument
 */
  //PpsPositionPlanDocument?: IIIdentifyable | null;

/*
 * PpsQTODocument
 */
  //PpsQTODocument?: IIIdentifyable | null;

/*
 * PpsStackListDocument
 */
  //PpsStackListDocument?: IIIdentifyable | null;

/*
 * ProductCollectionInfo
 */
  ProductCollectionInfo?: IProductCollectionInfoEntity | null;

/*
 * ProductionOrder
 */
  ProductionOrder?: string | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * PuInfo
 */
  PuInfo?: IPuInfo | null;

/*
 * Quantities
 */
  //Quantities?: {Quantity?: IIUomObject, ActualQuantity?: IIUomObject, RemainingQuantity?: IIUomObject, Null?: IIUomObject} | null;

/*
 * Reproduced
 */
  Reproduced?: boolean | null;

/*
 * ResRequisitionFk
 */
  ResRequisitionFk?: number | null;

/*
 * RoutesInfo
 */
  //RoutesInfo?: IIRoutesInfo | null;

/*
 * SiteFk
 */
  SiteFk?: number | null;

/*
 * TrsBundleStatusFk
 */
  TrsBundleStatusFk?: number | null;

/*
 * TrsBundleTypeFk
 */
  TrsBundleTypeFk?: number | null;

/*
 * TrsReq_DateshiftMode
 */
  TrsReq_DateshiftMode?: number | null;

/*
 * TrsReq_EventFk
 */
  TrsReq_EventFk?: number | null;

/*
 * TrsReq_Finish
 */
  TrsReq_Finish?: string | null;

/*
 * TrsReq_Start
 */
  TrsReq_Start?: string | null;

/*
 * TrsRequisitionDate
 */
  TrsRequisitionDate?: string | null;

/*
 * TrsRequisitionEventFk
 */
  TrsRequisitionEventFk?: number | null;

/*
 * TrsRequisitionFk
 */
  TrsRequisitionFk?: number | null;

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
 * Weight
 */
  Weight?: number | null;

/*
 * WeightSourceUomFk
 */
  WeightSourceUomFk?: number | null;

/*
 * Width
 */
  Width?: number | null;
}
