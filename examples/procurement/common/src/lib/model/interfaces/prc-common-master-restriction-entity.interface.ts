/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase } from '@libs/platform/common';

/**
 * Procurement Common Master Restriction base entity
 */
export interface IMasterRestrictionEntity extends IEntityBase {
	CopyType: number;
	MdcMaterialCatalogFk?: number;
	BoqWicCatFk?: number;
	PrjBoqFk?: number;
	BoqHeaderFk?: number;
	ConHeaderFk?: number;
	Visibility: number;
	BoqItemFk?: number;
	ConBoqHeaderFk?: number;
	PackageBoqHeaderFk?: number;
}