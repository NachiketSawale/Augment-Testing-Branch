/*
 * Copyright(c) RIB Software GmbH
 */


export interface ICreateContractRequest {
	SubPackageId: number,
	BpFK:number,
	SubsidiaryFk?: number | null,
	SupplierFk?: number | null,
	ContactFk?: number | null,
}

