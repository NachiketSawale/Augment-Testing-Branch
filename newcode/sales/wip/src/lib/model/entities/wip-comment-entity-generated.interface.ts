/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';

export interface IWipCommentEntityGenerated extends IEntityBase {

	/**
	 * CommentFk
	 */
	CommentFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * WipHeaderEntity
	 */
	WipHeaderEntity?: IWipHeaderEntity | null;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;
}
