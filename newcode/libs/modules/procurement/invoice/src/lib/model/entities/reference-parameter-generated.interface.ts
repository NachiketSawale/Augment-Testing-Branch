/*
 * Copyright(c) RIB Software GmbH
 */

export interface IReferenceParameterGenerated {
	/*
	 * businessPartnerFk
	 */
	businessPartnerFk?: number | null;

	/*
	 * code
	 */
	code?: string | null;

	/*
	 * id
	 */
	id: number;

	/*
	 * invStatusFk
	 */
	invStatusFk: number;

	/*
	 * reference
	 */
	reference?: string | null;

	/*
	 * supplierFk
	 */
	supplierFk: number;
}
