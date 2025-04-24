/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The following interfaces are used internally within the pin board container and
 * do not need to be exported to the index.ts file.
 */

import { CommentType } from '../../index';
import { BasicsSharedStatusLookupService } from '../../services/basics-shared-status-lookup.service';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { BlobsEntity } from '../../../interfaces/entities';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';

/**
 * The interface defines the structure of the response returned by last and remain HTTP APIs.
 */
export interface ICommentResponse<TEntity extends IEntityBase & IEntityIdentification> {
	RootCount: number | null;
	Clerks: IBasicsClerkEntity[];
	Blobs: BlobsEntity[];

	[key: string]: number | TEntity[] | IBasicsClerkEntity[] | BlobsEntity[] | null;
}

export interface ISubmitComment {
	comment: string;
	iconFk: number | null;
}

export interface IPinBoardEditorOptions {
	/** CommentType */
	commentType?: CommentType;

	/** parent comment status icon id */
	parentStatusId?: number;

	/** status lookup service */
	lookupService?: BasicsSharedStatusLookupService<object>;
}
