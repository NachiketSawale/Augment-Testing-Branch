/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterResource2etmPlantEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 PlantFk: number;
	 BasEtmContextFk: number;
	 CommentText?: number | null;
}