/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreatePesEntity {
	CreateTypeFk: number;
	PesId: number;
	UpdateWith: number;
	ContractId: number;
	DateDelivered: Date | string;
	QtoScope?: number;
	QtoDetailIds?: number[];
	QtoHeaderFk?: number;
}