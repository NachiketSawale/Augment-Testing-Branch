/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInvGeneralsEntityGenerated extends IEntityBase {
	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * IsCost
	 */
	IsCost: boolean;

	/*
	 * PrcGeneralstypeFk
	 */
	PrcGeneralstypeFk: number;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * Value
	 */
	Value: number;

	/*
	 * ValueType
	 */
	ValueType: number;
}
