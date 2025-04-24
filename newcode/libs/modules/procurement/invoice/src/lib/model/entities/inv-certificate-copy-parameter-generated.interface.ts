/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvCertificateCopyParameterGenerated {
	/*
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/*
	 * ConHeaderId
	 */
	ConHeaderId: number;

	/*
	 * ParentItem
	 */
	ParentItem?: IInvHeaderEntity | null;

	/*
	 * PrcHeaderId
	 */
	PrcHeaderId: number;
}
