/*
 * Copyright(c) RIB Software GmbH
 */

import { IBundleEntity } from './bundle-entity.interface';
import { IToBeAssignedEntity } from './to-be-assigned-entity.interface';
import { IProductCollectionInfoEntity } from './product-collection-info-entity.interface';
import { IPuInfo } from './pu-info.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IToBeAssignedEntityGenerated extends IEntityBase {

/*
 * Area
 */
  Area?: number | null;

/*
 * AvailableQuantity
 */
  AvailableQuantity?: number | null;

/*
 * BasUomAreaFk
 */
  BasUomAreaFk?: number | null;

/*
 * BasUomBillFk
 */
  BasUomBillFk?: number | null;

/*
 * BasUomHeightFk
 */
  BasUomHeightFk?: number | null;

/*
 * BasUomLengthFk
 */
  BasUomLengthFk?: number | null;

/*
 * BasUomPlanFk
 */
  BasUomPlanFk?: number | null;

/*
 * BasUomVolumeFk
 */
  BasUomVolumeFk?: number | null;

/*
 * BasUomWeightFk
 */
  BasUomWeightFk?: number | null;

/*
 * BasUomWidthFk
 */
  BasUomWidthFk?: number | null;

/*
 * BillQuantity
 */
  BillQuantity?: number | null;

/*
 * Bundle
 */
  Bundle?: IBundleEntity | null;

/*
 * BundleId
 */
  BundleId?: number | null;

/*
 * Children
 */
  Children?: IToBeAssignedEntity[] | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * ConcreteQuality
 */
  ConcreteQuality?: string | null;

/*
 * ConcreteVolume
 */
  ConcreteVolume?: number | null;

/*
 * CurrentLocationJobFk
 */
  CurrentLocationJobFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EngDrawingFk
 */
  EngDrawingFk?: number | null;

/*
 * Height
 */
  Height?: number | null;

/*
 * Id
 */
  Id?: string | null;

/*
 * IsForTransport
 */
  IsForTransport?: boolean | null;

/*
 * IsProduct
 */
  IsProduct?: boolean | null;

/*
 * IsolationVolume
 */
  IsolationVolume?: number | null;

/*
 * Length
 */
  Length?: number | null;

/*
 * LgmJobFkOfUpstream
 */
  LgmJobFkOfUpstream?: number | null;

/*
 * MaterialFk
 */
  MaterialFk?: number | null;

/*
 * MaterialGroupFk
 */
  MaterialGroupFk?: number | null;

/*
 * OpenQuantity
 */
  OpenQuantity?: number | null;

/*
 * PPSItemFk
 */
  PPSItemFk?: number | null;

/*
 * PlanQuantity
 */
  PlanQuantity?: number | null;

/*
 * PpsEventReqforFk
 */
  PpsEventReqforFk?: number | null;

/*
 * PpsEventtypeReqforFk
 */
  PpsEventtypeReqforFk?: number | null;

/*
 * PpsHeaderFk
 */
  PpsHeaderFk?: number | null;

/*
 * PpsItemUpstreamFk
 */
  PpsItemUpstreamFk?: number | null;

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
 * PpsStrandPatternFk
 */
  PpsStrandPatternFk?: number | null;

/*
 * PpsUpstreamGoodsTypeFk
 */
  PpsUpstreamGoodsTypeFk?: number | null;

/*
 * PpsUpstreamTypeFk
 */
  PpsUpstreamTypeFk?: number | null;

/*
 * PrjStockFk
 */
  PrjStockFk?: number | null;

/*
 * PrjStockLocationFk
 */
  PrjStockLocationFk?: number | null;

/*
 * Product
 */
  //Product?: IIPpsProductWithFullInfo | null;

/*
 * ProductCollectionInfo
 */
  ProductCollectionInfo?: IProductCollectionInfoEntity | null;

/*
 * ProductId
 */
  ProductId?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ProjectIdOfUpstream
 */
  ProjectIdOfUpstream?: number | null;

/*
 * PuInfo
 */
  PuInfo?: IPuInfo | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * RealId
 */
  RealId?: number | null;

/*
 * RemainingQuantity
 */
  RemainingQuantity?: number | null;

/*
 * RoutesInfo
 */
  //RoutesInfo?: IIRoutesInfo | null;

/*
 * SplitQuantity
 */
  SplitQuantity?: number | null;

/*
 * StatusId
 */
  StatusId?: number | null;

/*
 * TargetJobFk
 */
  TargetJobFk?: number | null;

/*
 * TimeStamp
 */
  TimeStamp?: string | null;

/*
 * TrsAssignedQuantity
 */
  TrsAssignedQuantity?: number | null;

/*
 * TrsBundleTypeFk
 */
  TrsBundleTypeFk?: number | null;

/*
 * TrsOpenQuantity
 */
  TrsOpenQuantity?: number | null;

/*
 * TrsProductBundleFk
 */
  TrsProductBundleFk?: string | null;

/*
 * TrsRequisitionFk
 */
  TrsRequisitionFk?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * UpstreamGoods
 */
  UpstreamGoods?: number | null;

/*
 * UpstreamItem
 */
  //UpstreamItem?: IIPpsUpstreamItemEntity | null;

/*
 * UpstreamItemId
 */
  UpstreamItemId?: number | null;

/*
 * UpstreamResult
 */
  UpstreamResult?: number | null;

/*
 * UpstreamResultStatus
 */
  UpstreamResultStatus?: number | null;

/*
 * Volume
 */
  Volume?: number | null;

/*
 * Weight
 */
  Weight?: number | null;

/*
 * Width
 */
  Width?: number | null;
}
