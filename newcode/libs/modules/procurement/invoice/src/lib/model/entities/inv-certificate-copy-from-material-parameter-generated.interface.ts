/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInvCertificateCopyFromMaterialParameterGenerated {
	/*
	 * BpdCertificateTypeIds
	 */
	BpdCertificateTypeIds?: number[] | null;

	/*
	 * InvHeaderId
	 */
	InvHeaderId: number;

	/*
	 * MdcMaterialId
	 */
	MdcMaterialId?: number | null;

	/*
	 * PrjProjectId
	 */
	PrjProjectId?: number | null;
}
