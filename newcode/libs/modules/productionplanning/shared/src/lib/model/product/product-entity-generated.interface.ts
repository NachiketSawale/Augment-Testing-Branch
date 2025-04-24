/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPpsProductEntityGenerated extends IEntityBase {

	ActualWeight?: number | null;

	Area: number;

	Area2: number;

	Area3: number;

	BasClobsFk: number;

	BasUomAreaFk: number;

	BasUomBillFk: number;

	BasUomHeightFk: number;

	BasUomLengthFk: number;

	BasUomPlanFk: number;

	BasUomVolumeFk: number;

	BasUomWeightFk: number;

	BasUomWidthFk: number;

	BillQuantity: number;

	// CanAssign?: boolean | null;

	CanRecalculate?: boolean | null;

	// CannotAssignReason?: string | null;

	Code: string;

	ConcreteQuality?: string | null;

	ConcreteVolume: number;

	CurrentLocationJobFk?: number | null;

	DescriptionInfo?: IDescriptionInfo | null;

	// DynamicDateTimes?: { [key: string]: string } | null;

	EndDate?: string | null;

	EngDrawingFk?: number | null;

	EngTmplRevisionFk?: number | null;

	EngineeringStackCode?: string | null;

	/*
	 * EventEntities
	 */
	// EventEntities?: IIPpsEventEntity[] | null;

	ExternalCode?: string | null;

	FabriCode?: string | null;

	FabriExternalCode?: string | null;

	Guid?: string | null;

	// HasProcessConfiguredForProdPlaceAssignment?: boolean | null;

	// HeaderIsForScrap?: boolean | null;

	Height: number;

	Id: number;

	// InstallationSequence?: number | null;

	// IsGettingProdPlaceByNesting?: boolean | null;

	IsLive: boolean;

	IsolationVolume: number;

	ItemFk: number;

	Length: number;

	LgmJobFk: number;

	MaterialFk?: number | null;

	// PermissionObjectInfo?: string | null;

	PlanQuantity: number;

	//PpsEPADocument?: IIIdentifyable | null;

	// PpsLayoutDrawingDocument?: IIIdentifyable | null;

	// PpsPositionPlanDocument?: IIIdentifyable | null;

	PpsProcessFk?: number | null;

	//PpsProductOrientationEntity?: IPpsProductOrientationEntity | null;

	// PpsProductOrientationFk?: number | null;

	PpsProductionSetSubFk?: number | null;

	// PpsQTODocument?: IIIdentifyable | null;

	//PpsStackListDocument?: IIIdentifyable | null;

	PpsStrandPatternFk?: number | null;

	PrjLocationFk?: number | null;

	PrjStockFk?: number | null;

	PrjStockLocationFk?: number | null;

	// ProdPlaceDescription?: string | null;

	ProdPlaceFk?: number | null;

	// ProdPlaceParentDescription?: string | null;

	// ProdPlaceParentFk?: number | null;

	ProductDescriptionFk: number;

	ProductStatusFk: number;

	ProductionOrder?: string | null;

	ProductionSetFk?: number | null;

	ProductionTime?: Date | null;

	ProjectId?: number | null;

	PuPrjLocationFk?: number | null;

	// Quantities?: {Quantity?: IIUomObject, ActualQuantity?: IIUomObject, RemainingQuantity?: IIUomObject, Null?: IIUomObject} | null;

	// Report2ProductId?: number | null;

	Reproduced?: boolean | null;

	// RoutesInfo?: IRoutesInfo | null;

	// SiteFks?: number[] | null;

	TrsProductBundleFk?: number | null;

	// TrsReq_DateshiftMode?: number | null;

	// TrsReq_Finish?: string | null;

	// TrsReq_Start?: string | null;

	TrsRequisitionDate?: string | null;

	TrsRequisitionEventFk?: number | null;

	TrsRequisitionFk?: number | null;

	UnitPrice: number;

	Userdefined1?: string | null;

	Userdefined2?: string | null;

	Userdefined3?: string | null;

	Userdefined4?: string | null;

	Userdefined5?: string | null;

	UserdefinedByProddesc1?: string | null;

	UserdefinedByProddesc2?: string | null;

	UserdefinedByProddesc3?: string | null;

	UserdefinedByProddesc4?: string | null;

	UserdefinedByProddesc5?: string | null;

	Volume: number;

	Volume2: number;

	Volume3: number;

	Weight: number;

	Weight2: number;

	Weight3: number;

	Width: number;
}
