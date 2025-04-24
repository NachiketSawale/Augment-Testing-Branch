/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInvPESCreateParameterGenerated {
	/*
	 * BillschemeFk
	 */
	BillschemeFk: number;

	/*
	 * BpdVatGroupFk
	 */
	BpdVatGroupFk?: number | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk: number;

	/*
	 * mainItemId
	 */
	mainItemId: number;
}
