/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentBusinessPartnerEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PartnerTypeFk: number;
	 BusinessPartnerFk: number;
	 ContactFk?: number | null;
	 SubsidiaryFk?: number | null;
	 CommentText?: string | null;
	 WarrantyDate?: Date | null;
}