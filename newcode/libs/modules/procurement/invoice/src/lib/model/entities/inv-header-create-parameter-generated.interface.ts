/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvHeaderCreateParameterGenerated {
	/*
	 * PreviousInvHeader
	 */
	PreviousInvHeader?: IInvHeaderEntity | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * mainItemId
	 */
	mainItemId: number;
}
