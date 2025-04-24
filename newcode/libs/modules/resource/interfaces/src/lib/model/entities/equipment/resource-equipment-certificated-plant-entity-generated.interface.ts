/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentCertificatedPlantEntityGenerated extends IEntityIdentification, IEntityBase {
	 CertificateFk: number;
	 PlantFk: number;
	 CommentText?: string | null;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
}