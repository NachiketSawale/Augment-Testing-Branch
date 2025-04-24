/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { BlobsEntity } from '@libs/basics/shared';

/**
 * Defect photo dto
 */
export interface IDfmPhotoEntity extends IEntityBase, IDocumentBaseEntity {
	/**
	 * Id
	 */
	Id: number;
	/**
	 * DfmDefectFk
	 */
	DfmDefectFk: number;
	/**
	 * BlobsFk
	 */
	BlobsFk: number;
	/**
	 * PhotoDate
	 */
	PhotoDate?: Date | null;
	/**
	 * CommentText
	 */
	CommentText: string | null;
	/**
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;
	/**
	 * BlobsEntity
	 */
	Blob: BlobsEntity;
}
