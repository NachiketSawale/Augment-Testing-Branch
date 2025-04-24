/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlant2EstimatePriceListEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PlantEstimatePriceListFk: number;
	 UomFk: number;
	 CommentText?: string | null;
	 QualityFactor: number;
}