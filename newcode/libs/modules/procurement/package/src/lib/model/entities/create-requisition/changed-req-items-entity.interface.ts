/*
 * Copyright(c) RIB Software GmbH
 */

export interface IChangedReqItemsEntity {
	Id: number;
	Code: string;
	Description: string;
	PackageQuantity: number;
	ContractQuantity: number;
	VarianceQuantity: number;
	StatusFk: number;
	UomFk: number;
}
