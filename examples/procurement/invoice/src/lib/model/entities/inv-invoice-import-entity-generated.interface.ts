/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInvInvoiceImportEntityGenerated extends IEntityBase {
	/*
	 * ErrorMessage
	 */
	ErrorMessage?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk?: number | null;

	/*
	 * Log
	 */
	Log?: string | null;

	/*
	 * Status
	 */
	Status: number;
}
