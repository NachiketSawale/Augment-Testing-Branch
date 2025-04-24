/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqCheckListCommentEntityGenerated extends IEntityBase {
	/**
	 * BasCommentFk
	 */
	BasCommentFk: number;

	/**
	 * HsqCheckListEntity
	 */
	HsqCheckListEntity?: IHsqCheckListEntity | null;

	/**
	 * HsqCheckListFk
	 */
	HsqCheckListFk: number;

	/**
	 * Id
	 */
	Id: number;
}
