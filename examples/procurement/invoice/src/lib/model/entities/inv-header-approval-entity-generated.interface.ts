/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvHeaderApprovalEntityGenerated extends IEntityBase {
	/*
	 * ClerkFk
	 */
	ClerkFk: number;

	/*
	 * ClerkRoleFk
	 */
	ClerkRoleFk?: number | null;

	/*
	 * Comment
	 */
	Comment?: string | null;

	/*
	 * DueDate
	 */
	DueDate?: Date | string | null;

	/*
	 * EvaluatedOn
	 */
	EvaluatedOn?: Date | string | null;

	/*
	 * EvaluationLevel
	 */
	EvaluationLevel?: number | null;

	/*
	 * HeaderEntity
	 */
	HeaderEntity?: IInvHeaderEntity | null;

	/*
	 * HeaderFk
	 */
	HeaderFk: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsApproved
	 */
	IsApproved: boolean;
}
