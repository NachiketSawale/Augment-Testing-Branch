/*
 * Copyright(c) RIB Software GmbH
 */
import { Translatable } from '@libs/platform/common';
import { CellChangeEvent } from '@libs/ui/common';
import { CurrencyEntity } from '@libs/basics/shared';
import { IQuoteHeaderLookUpEntity, IRequisitionEntity } from '@libs/procurement/shared';
import { IPrcItemEntity } from '@libs/procurement/common';
import { IReqBoqVariantEntity, IReqItemVariantEntity, IReqVariantEntity } from '@libs/procurement/requisition';
import { IRfqPartialReqAssignedEntity } from '@libs/procurement/rfq';
import { IQuoteHeaderEntity, IQuoteRequisitionEntity } from '@libs/procurement/quote';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';

export enum EvaluatedItemHandleMode {
	Ignore = '0',
	Bypass = '1',
	Takeover = '2',
	TakeoverWithPrice = '3'
}

export enum CreateContractMode {
	/** Create separate contract by each requisition */
	Multiple = '1',
	/** Create one contract with all requisitions */
	Single = '2'
}

export interface ICreateContractDialogOptions {
	loadOptions: () => Promise<ICreateContractOptions>;
	verify?: () => Promise<boolean>;
}

export interface ICreateContractOptions {
	showContractNote: boolean;
	hasChangeOrder: boolean;
	evaluatedItemHandleMode: EvaluatedItemHandleMode;
	items: CustomCompareColumnComposite[];
	onSelectChanged: (selectedItem: CustomCompareColumnComposite) => Promise<void>;
	onRequisitionCellChanged?: (evt: CellChangeEvent<ReqHeaderComposite>) => Promise<{ status: boolean; error?: string }>;
	getAllReqHeaders: (selectedItem: CustomCompareColumnComposite, items: CustomCompareColumnComposite[]) => Promise<ReqHeaderComposite[]>;
	quoteGroupName?: Translatable;
	customNote?: () => string;
	selectedQuoteIndex?: number;
}

export type CustomCompareColumnComposite = ICustomCompareColumnEntity & {
	IsChecked?: boolean;
	ReqCount: number | null;
	subTotal: number | null;
	grandTotal: number | null;
}

export type ReqHeaderComposite = IRequisitionEntity & {
	PrcItems?: IPrcItemEntity[];
	isForPartialReqAssigned?: boolean;
	isChecked?: boolean;
	reqHeader?: ReqHeaderComposite;
	reqTotal?: number;
	Children?: ReqHeaderComposite[];
};

export type ReqVariantInfo = {
	ReqVariants: Array<IReqVariantEntity & { isForPartialReqAssigned?: boolean; isChecked?: boolean }>;
	ReqItemVariants: IReqItemVariantEntity[];
	ReqBoqVariants: IReqBoqVariantEntity[];
	RfqParialReqAssigneds: IRfqPartialReqAssignedEntity[];
};

export type QtnReqCount = {
	QtnId: number;
	ReqCount: number;
}

export type Total = {
	QtnId: number;
	boqSubTotal: number;
	itemSubTotal: number;
	subTotal: number;
};

export type CompareColumnCompositeBaseResponse<MT extends object> = {
	Main: MT[];
	Quote: Array<IQuoteHeaderLookUpEntity & { DateQuotedFormatted?: string }>;
	Totals: Total[];
}

export type CompareColumnCompositeResponse = CompareColumnCompositeBaseResponse<CustomCompareColumnComposite> & {
	QtnReqCount: QtnReqCount[];
	QuoteRequisition: IQuoteRequisitionEntity[];
	Requisition: IRequisitionEntity[];
	RequisitionVariantInfo: ReqVariantInfo[];
};

export type CompareColumnCompositeSingleQuoteBaseResponse = CompareColumnCompositeBaseResponse<IQuoteHeaderEntity> & {
	RequisitionVariantInfo: ReqVariantInfo[];
	Currency: CurrencyEntity[];
}

export type CompareColumnCompositeSingleQuoteBoqResponse = CompareColumnCompositeSingleQuoteBaseResponse & {
	BoqRootItems2ReqHeader: Array<{ ReqHeaderId: number; BoqRootItems: Array<{ Finalprice: number }> }>;
};

export type CompareColumnCompositeSingleQuoteItemResponse = CompareColumnCompositeSingleQuoteBaseResponse;

export interface ICreateContractShowContractsDialogContext {
	contracts: IConHeaderEntity[],
	hintInfo: string;
	hasContractItem: boolean;
	evaluatedItemHandleMode: EvaluatedItemHandleMode;
}