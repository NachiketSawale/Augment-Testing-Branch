/*
 * Copyright(c) RIB Software GmbH
 */

export interface IExistedValidBaseRequisitionEntity {
	Selected: boolean;
	Id: number;
	ReqStatusFk: number;
	Code: string;
	Description: string;
	TotalQuantity: number;
}
