/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPrcCertificateCopyParameters {
	PrcHeaderId?: number;
	PrjProjectId?: number;
	MdcMaterialId?: number;
	InvHeaderId?: number;
	BpdCertificateTypeIds?: number[];
}