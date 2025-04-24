/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterPhotoEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 BlobsFk: number;
	 PhotoDate?: number | null;
	 CommentText?: string | null;
}