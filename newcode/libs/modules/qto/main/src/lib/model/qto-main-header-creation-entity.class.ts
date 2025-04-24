/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface QtoMainHeaderCreationEntity {
	ClerkFk?: number | null;
	PrcBoqFk?: number | null;
	PrjBoqFk?: number | null;
	ProjectFk?: number;
	PackageFk?: number | null;
	OrdHeaderFk?: number | null;
	ConHeaderFk?: number | null;
	QtoTargetType?: number;
	QtoType?: number;
	Code?: string;
	Description?: string;
	ContractCode?: string;
	PrcStructureFk?: number | null;
	BusinessPartnerFk?: number | null;
	PrcHeaderFk?: number | null;
	PrcHeaderFkOriginal?: number;
	BoqSource?: number;
	Package2HeaderFK?: number | null;
	BoqHeaderFk?: number | null;
	BasRubricCategoryFk: number;
	BasGoniometerTypeFk?: number;
	PrcCopyModeFk?: number | null;
	IsGenerated: boolean;
}