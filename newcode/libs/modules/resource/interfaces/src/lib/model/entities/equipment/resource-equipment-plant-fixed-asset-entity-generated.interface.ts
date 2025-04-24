/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantFixedAssetEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 CompanyFk: number;
	 Code: string | null;
	 Percentage: number;
	 FixedAssetFk?: number | null;
	 Description?: string | null;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
}