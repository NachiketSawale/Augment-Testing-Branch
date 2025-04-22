/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvRejectEntity } from './inv-reject-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IInvRejectionReasonEntityGenerated extends IEntityBase {
	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvRejectEntities
	 */
	InvRejectEntities?: IInvRejectEntity[] | null;

	/*
	 * IsAwaitingCreditNote
	 */
	IsAwaitingCreditNote: boolean;

	/*
	 * IsDefault
	 */
	IsDefault: boolean;

	/*
	 * IsLive
	 */
	IsLive: boolean;

	/*
	 * Sorting
	 */
	Sorting: number;
}
