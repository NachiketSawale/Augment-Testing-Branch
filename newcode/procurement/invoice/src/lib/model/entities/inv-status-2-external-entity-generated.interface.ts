/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvStatusEntity } from './inv-status-entity.interface';

export interface IInvStatus2externalEntityGenerated extends IEntityBase {
	/*
	 * BasExternalsourceFk
	 */
	BasExternalsourceFk: number;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ExtCode
	 */
	ExtCode: string;

	/*
	 * ExtDescription
	 */
	ExtDescription?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvStatusEntity
	 */
	InvStatusEntity?: IInvStatusEntity | null;

	/*
	 * InvStatusFk
	 */
	InvStatusFk: number;

	/*
	 * Isdefault
	 */
	Isdefault: boolean;

	/*
	 * Islive
	 */
	Islive: boolean;

	/*
	 * Sorting
	 */
	Sorting: number;
}
