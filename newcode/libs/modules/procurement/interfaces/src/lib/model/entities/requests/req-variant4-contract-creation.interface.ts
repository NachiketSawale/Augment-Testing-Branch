/*
 * Copyright(c) RIB Software GmbH
 */


export interface IReqVariant4ContractCreation{
	id: number;
	reqHeaderFk: number;
	businessPartnerFk: number;
	subsidiaryFk?:number|null;
	supplierFk?:number|null;
	contactFk?:number|null;
}
