/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IProjectInfoRequestRelevantToEntityGenerated extends IEntityIdentification, IEntityBase {
	InfoRequestFk: number;
	BusinesspartnerFk: number;
	ContactFk?: number;
	CommentText: string;
}