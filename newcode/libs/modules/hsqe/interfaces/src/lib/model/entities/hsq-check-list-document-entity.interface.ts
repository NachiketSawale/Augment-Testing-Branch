/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

export interface IHsqCheckListDocumentEntity extends IEntityBase, IDocumentBaseEntity {
	/**
	 * CheckListFk
	 */
	CheckListFk: number;
	/**
	 * CommentText
	 */
	CommentText?: string | null;
}
