/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantDocumentEntityGenerated extends IEntityIdentification, IEntityBase {
	 Description?: string | null;
	 PlantFk: number;
	 PlantDocumentTypeFk: number;
	 DocumentTypeFk: number;
	 Date?: Date | null;
	 Barcode?: string | null;
	 FileArchiveDocFk?: number | null;
	 Url?: string | null;
	 IsHiddenInPublicApi: boolean;
}