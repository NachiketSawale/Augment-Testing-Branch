/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantComponentEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PlantComponentTypeFk: number;
	 MaintenanceSchemaFk?: number | null;
	 Description?: string | null;
	 MeterNo?: string | null;
	 UomFk?: number | null;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
	 EndWarranty?: Date | null;
	 CommentText?: string | null;
	 UserDefined01?: string | null;
	 UserDefined02?: string | null;
	 UserDefined03?: string | null;
	 UserDefined04?: string | null;
	 UserDefined05?: string | null;
	 NfcId?: string | null;
	 SerialNumber?: string | null;
	 HomeProjectFk?: number | null;
	 ProjectLocationFk?: number | null;
}