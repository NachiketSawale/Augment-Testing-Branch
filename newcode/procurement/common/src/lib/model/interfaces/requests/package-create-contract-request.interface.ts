/*
 * Copyright(c) RIB Software GmbH
 */


export interface IPackageCreateContractRequest{
	SubPackageId: number,
	BpFK:number,
	SubsidiaryFk?: number | null,
	SupplierFk?: number | null,
	ContactFk?: number | null,
}

