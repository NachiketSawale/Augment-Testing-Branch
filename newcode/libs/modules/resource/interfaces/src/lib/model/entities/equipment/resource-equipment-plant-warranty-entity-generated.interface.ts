/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantWarrantyEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PlantComponentFk: number;
	 WarrantyTypeFk: number;
	 WarrantyStatusFk: number;
	 Quantity?: number | null;
	 UomFk?: number | null;
	 Hours?: number | null;
	 WarrantyStart: Date | null;
	 WarrantyEnd?: Date | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 CommentText?: string | null;
	 Remark?: string | null;
	 UserDefinedText01?: string | null;
	 UserDefinedText02?: string | null;
	 UserDefinedText03?: string | null;
	 UserDefinedText04?: string | null;
	 UserDefinedText05?: string | null;
	 UserDefinedDate01?: Date | null;
	 UserDefinedDate02?: Date | null;
	 UserDefinedDate03?: Date | null;
	 UserDefinedDate04?: Date | null;
	 UserDefinedDate05?: Date | null;
}