/*
 * Copyright(c) RIB Software GmbH
 */

export interface IItemEvaluationBoqItemEntity {
	IsChecked: boolean;
	Id: number;
	QuoteHeaderId: number;
	BoqLineTypeFk: number;
	Reference: string;
	BriefInfo: string;
	Quantity: number;
	BasUomFk: number;
	Price: number;
	Finalprice: number;
}