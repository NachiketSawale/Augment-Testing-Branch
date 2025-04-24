/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlant2EstimatePriceListLineItemEntityGenerated extends IEntityIdentification, IEntityBase {
	 Plant2EstimatePriceListFk: number;
	 EstimateHeaderFk: number;
	 EstimateLineItemFk: number;
	 CommentText?: string | null;
	 PlantAssemblyTypeFk?: number | null;
}