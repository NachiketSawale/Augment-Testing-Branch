/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterPoolEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 ResourceSubFk: number;
	 CommentText?: string | null;
	 Quantity: number;
	 Validfrom?: Date | null;
	 Validto?: Date | null;
}