/*
 * Copyright(c) RIB Software GmbH
 */

export interface IItemEvaluationPrcItemEntity {
	IsChecked: boolean;
	Id: number;
	QuoteHeaderId: number;
	PrcHeaderFk: number;
	Itemno: string;
	Specification: string;
	Quantity: number;
	BasUomFk: number;
	Price: number;
	Description1: string;
}