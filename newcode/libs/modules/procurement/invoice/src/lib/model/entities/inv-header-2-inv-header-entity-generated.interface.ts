/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvHeader2InvHeaderEntityGenerated extends IEntityBase {
	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderChainedEntity
	 */
	InvHeaderChainedEntity?: IInvHeaderEntity | null;

	/*
	 * InvHeaderChainedFk
	 */
	InvHeaderChainedFk: number;

	/*
	 * InvHeaderChainedProgressId
	 */
	InvHeaderChainedProgressId: number;

	/*
	 * InvHeaderEntity
	 */
	InvHeaderEntity?: IInvHeaderEntity | null;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;
}
