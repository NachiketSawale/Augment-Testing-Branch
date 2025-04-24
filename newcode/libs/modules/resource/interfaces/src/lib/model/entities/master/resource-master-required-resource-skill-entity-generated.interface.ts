/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterRequiredResourceSkillEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 SkillFk: number;
	 CommentText?: string | null;
}