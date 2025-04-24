/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IIdentificationData } from '@libs/platform/common';
import { IPpsPlannedQuantityEntityGenerated } from './pps-planned-quantity-entity-generated.interface';

export interface IPpsPlannedQuantityEntity extends IPpsPlannedQuantityEntityGenerated {
	ChildItems?: IPpsPlannedQuantityEntity[] | null;
	PlnQtySpecifiedChildItemsForSlot?: IPpsPlannedQuantityEntity[] | null;
	SpecifiedChildItemsForSlot?: IIdentificationData[] | null;
	DynamicQuantities?: { [key: string]: number } | null;
	BoQEstItemResFk?: number | null;
	HasChildren?: boolean | null;
	PropertyMaterialCostcodeFk?: string | null;
	ResourceTypeFk?: number | null;

	ProjectFk?: number | null; // additional property from: PlannedQuantity.PpsHeaderFk -> PpsHeader -> PpsHeader.PrjProjectFk
}
