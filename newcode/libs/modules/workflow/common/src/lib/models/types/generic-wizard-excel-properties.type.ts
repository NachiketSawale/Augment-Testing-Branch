/*
 * Copyright(c) RIB Software GmbH
 */


export const BOQ_EXCEL_ITEM_PROPS = ['Reference', 'BriefInfo', 'BoqLineTypeFk', 'BasItemTypeFk', 'BasItemType2Fk', 'IsFreeQuantity', 'Quantity', 'BasUomFk', 'Price', 'IsUrb', 'Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6', 'CommentClient', 'CommentContractor', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'ExternalCode', 'OrdQuantity', 'PrevQuantity', 'DeliveryDate', 'MdcMaterialFk'] as const;

type GenericItemProps<T extends string> = {
	[key in T]: string;
}

type BoqItemProps = GenericItemProps<(typeof BOQ_EXCEL_ITEM_PROPS)[number]>

export type ExcelProperties = {
	BoqItem: BoqItemProps,
	PrcItem: {
		Itemno: string;
		Description1: string;
		Quantity: string;
		BasUomFk: string;
		Price: string;
		TotalPrice: string
	}
};
