/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantMeterReadingEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantComponentFk: number;
	 Recorded?: Date | null;
	 Quantity: number;
	 Comment?: string | null;
	 UserDefinedText01?: string | null;
	 UserDefinedText02?: string | null;
	 UserDefinedText03?: string | null;
	 UserDefinedText04?: string | null;
	 UserDefinedText05?: string | null;
	 UserDefinedInt01?: number | null;
	 UserDefinedInt02?: number | null;
	 UserDefinedInt03?: number | null;
	 UserDefinedInt04?: number | null;
	 UserDefinedInt05?: number | null;
	 UserDefinedDate01?: Date | null;
	 UserDefinedDate02?: Date | null;
	 UserDefinedDate03?: Date | null;
	 UserDefinedDate04?: Date | null;
	 UserDefinedDate05?: Date | null;
	 UserDefinedNumber01?: number | null;
	 UserDefinedNumber02?: number | null;
	 UserDefinedNumber03?: number | null;
	 UserDefinedNumber04?: number | null;
	 UserDefinedNumber05?: number | null;
	 Longitude?: number | null;
	 Latitude?: number | null;
	 PlantFk: number;
}