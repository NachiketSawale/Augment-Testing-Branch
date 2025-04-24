/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProjectMainProjectReleaseEntity extends IEntityBase {

	Id: number;
	ProjectFk: number;
	CommentText: string;
	ReleaseDate: Date;
	UserDefinedText01: string;
	UserDefinedText02: string;
	UserDefinedText03: string;
	UserDefinedText04: string;
	UserDefinedText05: string;
}