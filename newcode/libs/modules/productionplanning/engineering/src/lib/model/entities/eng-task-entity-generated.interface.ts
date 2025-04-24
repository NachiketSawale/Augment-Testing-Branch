/*
 * Copyright(c) RIB Software GmbH
 */

import { IEngTask2ClerkEntity } from './eng-task-2-clerk-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IPPSEventEntity } from '@libs/productionplanning/shared';
import { IRequiredSkillEntity } from '@libs/resource/interfaces';

export interface IEngTaskEntityGenerated extends IEntityBase {
	/**
	 * ActualFinish
	 */
	ActualFinish?: string | null;

	/**
	 * ActualQuantity
	 */
	ActualQuantity: number;

	/**
	 * ActualStart
	 */
	ActualStart?: string | null;

	/**
	 * BasUomFk
	 */
	BasUomFk: number;

	/**
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/**
	 * BusinessPartnerOrderFk
	 */
	BusinessPartnerOrderFk?: number | null;

	/**
	 * CalCalendarFk
	 */
	CalCalendarFk: number;

	/**
	 * ClerkFk
	 */
	ClerkFk: number;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * DateshiftMode
	 */
	DateshiftMode: number;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * DynamicClerks
	 */
	DynamicClerks?: { [key: string]: number } | null;

	/**
	 * DynamicDateTimes
	 */
	DynamicDateTimes?: { [key: string]: string } | null;

	/**
	 * EarliestFinish
	 */
	EarliestFinish?: string | null;

	/**
	 * EarliestStart
	 */
	EarliestStart?: string | null;

	/**
	 * EngDrawingFk
	 */
	EngDrawingFk?: number | null;

	/**
	 * EngDrawingTypeFk
	 */
	EngDrawingTypeFk?: number | null;

	/**
	 * EngHeaderFk
	 */
	EngHeaderFk: number;

	/**
	 * EngTask2ClerkEntities
	 */
	EngTask2ClerkEntities?: IEngTask2ClerkEntity[] | null;

	/**
	 * EngTaskStatusFk
	 */
	EngTaskStatusFk: number;

	// /**
	//  * Entity2ClerkEntities
	//  */
	// Entity2ClerkEntities?: IIEntity2ClerkEntity[] | null;

	/**
	 * EventEntities
	 */
	EventEntities?: IPPSEventEntity[] | null;

	/**
	 * EventTypeFk
	 */
	EventTypeFk: number;

	/**
	 * HasEvent
	 */
	HasEvent: boolean;

	/**
	 * HasProductDescriptions
	 */
	HasProductDescriptions: boolean;

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
	 * IsPartOfEventSequence
	 */
	IsPartOfEventSequence: boolean;

	/**
	 * IsUpstreamDefined
	 */
	IsUpstreamDefined?: string | null;

	/**
	 * ItemEventEntities
	 */
	ItemEventEntities?: IPPSEventEntity[] | null;

	/**
	 * JobDefFk
	 */
	JobDefFk?: number | null;

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
	 * LoginClerkRoles
	 */
	LoginClerkRoles?: string | null;

	/**
	 * MaterialGroupFk
	 */
	MaterialGroupFk?: number | null;

	/**
	 * MdcControllingunitFk
	 */
	MdcControllingunitFk?: number | null;

	/**
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/**
	 * PPSItemFk
	 */
	PPSItemFk?: number | null;

	/**
	 * PPSItem_LgmJobFk
	 */
	PPSItem_LgmJobFk?: number | null;

	/**
	 * PPSItem_PpsHeaderFk
	 */
	PPSItem_PpsHeaderFk?: number | null;

	/**
	 * PPSItem_ProjectFk
	 */
	PPSItem_ProjectFk?: number | null;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

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
	 * PpsItemMaterialCodes
	 */
	PpsItemMaterialCodes?: string | null;

	// /**
	//  * PpsItemMaterialInfos
	//  */
	// PpsItemMaterialInfos?: IMaterialInfo | null;

	/**
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/**
	 * ProjectId
	 */
	ProjectId?: number | null;

	/**
	 * PsdActivityFk
	 */
	PsdActivityFk?: number | null;

	// /**
	//  * Quantities
	//  */
	// Quantities?: { Quantity?: IIUomObject; ActualQuantity?: IIUomObject; RemainingQuantity?: IIUomObject; Null?: IIUomObject } | null;

	/**
	 * Quantity
	 */
	Quantity?: number | null;

	/**
	 * RemainingQuantity
	 */
	RemainingQuantity: number;

	/**
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * RequiredSkillList
	 */
	RequiredSkillList?: IRequiredSkillEntity[] | null;

	/**
	 * SiteFk
	 */
	SiteFk: number;

	/**
	 * SiteInfo
	 */
	SiteInfo?: string | null;

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
	 * WeekInfo
	 */
	WeekInfo?: string | null;
}
