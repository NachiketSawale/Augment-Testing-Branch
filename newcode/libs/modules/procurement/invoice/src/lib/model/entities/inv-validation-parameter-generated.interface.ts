/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInvValidationParameterGenerated extends IEntityBase {
	/*
	 * BasMessageFk
	 */
	BasMessageFk: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * Message
	 */
	Message?: string | null;

	/*
	 * MessageFormat
	 */
	MessageFormat?: string | null;

	/*
	 * MessageseverityFk
	 */
	MessageseverityFk: number;

	/*
	 * Parameter1
	 */
	Parameter1?: string | null;

	/*
	 * Parameter2
	 */
	Parameter2?: string | null;

	/*
	 * Parameter3
	 */
	Parameter3?: string | null;

	/*
	 * Reference
	 */
	Reference?: number | null;

	/*
	 * ReferenceType
	 */
	ReferenceType?: number | null;
}
