/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsEventParentEntity } from '@libs/productionplanning/shared';
import { ITransportPackageEntity } from './transport-package-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ITransportPackageEntityGenerated extends IEntityBase, IPpsEventParentEntity {
	/**
	 * BundleFk
	 */
	BundleFk?: number | null;

	/**
	 * ChildPackages
	 */
	ChildPackages?: ITransportPackageEntity[] | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * DangerQuantity
	 */
	DangerQuantity?: number | null;

	/**
	 * DangerclassFk
	 */
	DangerclassFk?: number | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * DrawingFk
	 */
	DrawingFk?: number | null;

	/**
	 * DynamicDateTimes
	 */
	DynamicDateTimes?: { [key: string]: Date | string } | null;

	/**
	 * EtmPlantFk
	 */
	EtmPlantFk?: number | null;

	/**
	 * Good
	 */
	Good?: number | null;

	/**
	 * GoodIsCancelled
	 */
	GoodIsCancelled: boolean;

	/**
	 * HasChildren
	 */
	HasChildren: boolean;

	/**
	 * Height
	 */
	Height?: number | null;

	/**
	 * HeightCalculated
	 */
	HeightCalculated?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * InfoSummary
	 */
	InfoSummary?: string | null;

	/**
	 * Kind
	 */
	Kind?: string | null;

	/**
	 * Length
	 */
	Length?: number | null;

	/**
	 * LengthCalculated
	 */
	LengthCalculated?: number | null;

	/**
	 * LgmDispatchHeaderFk
	 */
	LgmDispatchHeaderFk?: number | null;

	/**
	 * LgmDispatchRecordFk
	 */
	LgmDispatchRecordFk?: number | null;

	/**
	 * LgmJobDstFk
	 */
	LgmJobDstFk?: number | null;

	/**
	 * LgmJobSrcFk
	 */
	LgmJobSrcFk?: number | null;

	/**
	 * MaterialFk
	 */
	MaterialFk?: number | null;

	/**
	 * MaterialInfo
	 */
	MaterialInfo?: string | null;

	/**
	 * PackageTypeFk
	 */
	PackageTypeFk?: number | null;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/**
	 * PpsProductFk
	 */
	PpsProductFk?: number | null;

	/**
	 * PpsUpstreamItemFk
	 */
	PpsUpstreamItemFk?: number | null;

	/**
	 * ProductStatus
	 */
	ProductStatus?: number | null;

	/**
	 * ProductTemplateCode
	 */
	ProductTemplateCode?: string | null;

	/**
	 * ProductionOrder
	 */
	ProductionOrder?: string | null;

	/**
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/**
	 * Quantity
	 */
	Quantity: number;

	/**
	 * Reproduced
	 */
	Reproduced: boolean;

	/**
	 * ResReservationFk
	 */
	ResReservationFk?: number | null;

	/**
	 * ResResourceFk
	 */
	ResResourceFk?: number | null;

	/**
	 * Summary
	 */
	Summary?: string | null;

	/**
	 * TransportPackageFk
	 */
	TransportPackageFk?: number | null;

	/**
	 * TrsGoodsFk
	 */
	TrsGoodsFk?: number | null;

	/**
	 * TrsPackageSubFk
	 */
	TrsPackageSubFk?: number | null;

	/**
	 * TrsPkgStatusFk
	 */
	TrsPkgStatusFk: number;

	/**
	 * TrsPkgTypeFk
	 */
	TrsPkgTypeFk: number;

	/**
	 * TrsProductBundleFk
	 */
	TrsProductBundleFk?: number | null;

	/**
	 * TrsRequisitionFk
	 */
	TrsRequisitionFk?: number | null;

	/**
	 * TrsRouteFk
	 */
	TrsRouteFk?: number | null;

	/**
	 * TrsWaypointDstFk
	 */
	TrsWaypointDstFk?: number | null;

	/**
	 * TrsWaypointSrcFk
	 */
	TrsWaypointSrcFk?: number | null;

	/**
	 * UomDGFk
	 */
	UomDGFk?: number | null;

	/**
	 * UomFk
	 */
	UomFk?: number | null;

	/**
	 * UomHeightFk
	 */
	UomHeightFk: number;

	/**
	 * UomLengthFk
	 */
	UomLengthFk: number;

	/**
	 * UomWeightFk
	 */
	UomWeightFk: number;

	/**
	 * UomWidthFk
	 */
	UomWidthFk: number;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/**
	 * Weight
	 */
	Weight?: number | null;

	/**
	 * WeightCalculated
	 */
	WeightCalculated?: number | null;

	/**
	 * Width
	 */
	Width?: number | null;

	/**
	 * WidthCalculated
	 */
	WidthCalculated?: number | null;

	/**
	 * StatusOfGoods
	 */
	StatusOfGoods?: string | null;
}
