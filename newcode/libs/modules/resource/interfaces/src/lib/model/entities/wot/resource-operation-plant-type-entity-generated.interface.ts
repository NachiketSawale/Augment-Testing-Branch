/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IResourceOperationPlantTypeEntityGenerated extends IEntityBase, IEntityIdentification {
	WorkOperationTypeFk: number;
	PlantTypeFk: number;
	Comment?: string;
	IsDefault: boolean;
	IsTimekeepingDefault: boolean;
}