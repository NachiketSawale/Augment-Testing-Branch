/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomQuoteItemBase } from './custom-quote-item-base.interface';
import { IOriginalField } from './original-field.interface';
import { ICustomGeneralItem } from './custom-general-item.interface';
import { IExtendableObject } from './extendable-object.interface';
import { IGridNodeInfo } from './grid-node-info.interface';
import { IOriginPriceExcludeTarget } from './origin-price-exclude-target.interface';

export interface ICompositeBaseEntity<T extends object, QT extends ICustomQuoteItemBase = ICustomQuoteItemBase> extends IExtendableObject {
	Id: string;
	ParentId?: string;
	CompareDescription: string;
	parentItem?: T | null;
	_rt$Deleted?: boolean;
	LineTypeFk: number;
	HasChildren: boolean;
	Children: T[];
	LineName?: string | null;
	cssClass?: string;
	IsQuoteNewItem?: boolean;
	QuoteItems: QT[];
	OriginalFields?: IOriginalField[] | null;
	IsContracted: boolean;
	IsFreeQuantity: boolean;
	PrcHeaderId: number;
	PrcItemEvaluationFk?: number | null;
	PrjChangeFk?: number | null;
	PrjChangeStatusFk?: number | null;
	QtnHeaderId: number;
	QtnVersion: number;
	Quantity: number;
	ReqHeaderId: number;
	RfqHeaderId: number;
	UomFk: number;
	QuoteGeneralItems: ICustomGeneralItem[];
	GeneralTypeId?: number,
	/**
	 * store quote keys/values for bidders (including Target)
	 */
	totals?: IExtendableObject<number | string>,
	totalArray?: number[]; // TODO-DRIZZLE: To be checked, can it be replace with totalValuesExcludeTarget?
	/**
	 * store quote values for bidders (including Target)
	 */
	totalValues?: number [],
	/**
	 * store quote values for bidders (exclude Target)
	 */
	totalValuesExcludeTarget?: number [],
	ranks?: IExtendableObject<number | string>,
	percentages?: IExtendableObject<number | string>,
	/**
	 * store quote keys/values for bidders (include Target)
	 */
	leadingFields?: IExtendableObject,
	BudgetTotal?: number | null;
	BudgetPerUnit?: number | null;
	finalBillingSchemas?: IExtendableObject;
	leadingFieldValues?: number[];
	leadingFieldValuesExcludeTarget?: number[];
	originPriceExcludeTarget?: IOriginPriceExcludeTarget[];
	CompareField?: string;
	QuoteField?: string;
	ChosenBusinessPartner?: boolean;
	rowType?: string;
	QuoteKey?: string;

	[p: string]: unknown;

	nodeInfo?: IGridNodeInfo;
}