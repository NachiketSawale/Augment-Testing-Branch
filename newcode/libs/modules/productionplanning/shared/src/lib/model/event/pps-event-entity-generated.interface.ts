/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IPPSEventEntityGenerated {
	Id: number;
	EventTypeFk: number;
	HeaderFk?: number;
	ItemFK?: number;
	PsdActivityFk?: number | null;
	ProductFk?: number;
	ProductDescriptionFk?: number;
	OrdHeaderFk?: number;
	ProductionSetFk?: number;
	TrsProductBundleFk?: number;
	TrsPackageFk?: number;
	CalCalendarFk: number;
	PlannedStart?: string | null;
	PlannedFinish?: string | null;
	EarliestStart?: string | null;
	EarliestFinish?: string | null;
	LatestStart?: string | null;
	LatestFinish?: string | null;
	PrjLocationFk?: number;
	MdcControllingunitFk?: number | null;
	LgmJobFk?: number | null;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt: Date;
	UpdatedBy?: number;
	Version: number;
	ActualStart?: string | null;
	ActualFinish?: string | null;
	Quantity?: number | null;
	BasUomFk: number;
	PpsEventFk?: number;
	IsLocked: boolean;
	IsLeaf: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsLive: boolean;
	DateshiftMode: number;
}
