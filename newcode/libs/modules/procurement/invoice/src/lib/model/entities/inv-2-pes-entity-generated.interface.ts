/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInv2PESEntityGenerated extends IEntityBase {
	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk: number;

	/*
	 * PesStatusFk
	 */
	PesStatusFk: number;

	/*
	 * PesValue
	 */
	PesValue: number;

	/*
	 * PesValueOc
	 */
	PesValueOc: number;

	/*
	 * PesVat
	 */
	PesVat: number;

	/*
	 * PesVatOc
	 */
	PesVatOc: number;
}
