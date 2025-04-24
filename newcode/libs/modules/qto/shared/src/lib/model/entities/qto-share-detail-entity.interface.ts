/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IQtoShareStatusEntity } from './qto-share-status-entity.interface';
import { IQtoShareFormulaEntity } from './qto-share-formula-entity.interface';
import { BlobsEntity } from '@libs/basics/shared';
/**
 * qto detail entity interface
 */
export interface IQtoShareDetailEntity extends IEntityBase, IEntityIdentification {
	/*
	 * AssetMasterFk
	 */
	AssetMasterFk?: number | null;

	/*
	 * BasBlobsFk
	 */
	BasBlobsFk?: number | null;

	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * BidHeaderFk
	 */
	BidHeaderFk?: number | null;

	/*
	 * BilHeaderFk
	 */
	BilHeaderFk?: number | null;

	/*
	 * BillReadOnly
	 */
	BillReadOnly?: boolean | null;

	/*
	 * BillToFk
	 */
	BillToFk?: number | null;

	/*
	 * Blob
	 */
	Blob?: BlobsEntity | null;

	/*
	 * BoqHeaderFk
	 */
	BoqHeaderFk: number;

	/*
	 * BoqItemCode
	 */
	BoqItemCode?: string | null;

	/*
	 * BoqItemFk
	 */
	BoqItemFk: number;

	/*
	 * BoqItemReferenceFk
	 */
	BoqItemReferenceFk?: number | null;

	/*
	 * BoqSplitQuantityFk
	 */
	BoqSplitQuantityFk?: number | null;

	/*
	 * BudgetCodeFk
	 */
	BudgetCodeFk?: number | null;

	/*
	 * ClassificationFk
	 */
	ClassificationFk?: number | null;

	/*
	 * CostGroupsToCopy
	 */
	// CostGroupsToCopy?: IMainItem2CostGroupEntity[] | null;

	/*
	 * Factor
	 */
	Factor?: number | null;

	/*
	 * FormulaResult
	 */
	FormulaResult?: string | null;

	/*
	 * GroupBySourceBoqItemFk
	 */
	GroupBySourceBoqItemFk?: boolean | null;

	/*
	 * HasSplitQuantiy
	 */
	HasSplitQuantiy: boolean;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsAQ
	 */
	IsAQ: boolean;

	/*
	 * IsBQ
	 */
	IsBQ: boolean;

	/*
	 * IsBlocked
	 */
	IsBlocked: boolean;

	/*
	 * IsBoqItemChange
	 */
	IsBoqItemChange?: boolean | null;

	/*
	 * IsBoqSplitChange
	 */
	IsBoqSplitChange?: boolean | null;

	/*
	 * IsCalculate
	 */
	IsCalculate?: boolean | null;

	/*
	 * IsCheck
	 */
	IsCheck?: boolean | null;

	/*
	 * IsCopy
	 */
	IsCopy?: boolean | null;

	/*
	 * IsEstimate
	 */
	IsEstimate: boolean;

	/*
	 * IsIQ
	 */
	IsIQ: boolean;

	/*
	 * IsModifyLineReference
	 */
	IsModifyLineReference?: boolean | null;

	/*
	 * IsNotCpoyCostGrp
	 */
	IsNotCpoyCostGrp?: boolean | null;

	/*
	 * IsOK
	 */
	IsOK: boolean;

	/*
	 * IsReadonly
	 */
	IsReadonly: boolean;

	IsCopySource: boolean;

	/*
	 * IsSameUom
	 */
	IsSameUom?: boolean | null;

	/*
	 * IsSheetReadonly
	 */
	IsSheetReadonly?: boolean | null;

	/*
	 * IsSplitted
	 */
	IsSplitted: boolean;

	/*
	 * IsSynced
	 */
	IsSynced?: boolean | null;

	/*
	 * IsWQ
	 */
	IsWQ: boolean;

	/*
	 * LineIndex
	 */
	LineIndex: number;

	/*
	 * LineReference
	 */
	LineReference?: string | null;

	/*
	 * LineText
	 */
	LineText?: string | null;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * Operator1
	 */
	Operator1?: string | null;

	/*
	 * Operator2
	 */
	Operator2?: string | null;

	/*
	 * Operator3
	 */
	Operator3?: string | null;

	/*
	 * Operator4
	 */
	Operator4?: string | null;

	/*
	 * Operator5
	 */
	Operator5?: string | null;

	/*
	 * OrdHeaderFk
	 */
	OrdHeaderFk?: number | null;

	/*
	 * PageNumber
	 */
	PageNumber: number;

	/*
	 * PerformedDate
	 */
	PerformedDate?: string | null;

	/*
	 * PerformedFromBil
	 */
	PerformedFromBil?: string | null;

	/*
	 * PerformedFromWip
	 */
	PerformedFromWip?: string | null;

	/*
	 * PerformedToBil
	 */
	PerformedToBil?: string | null;

	/*
	 * PerformedToWip
	 */
	PerformedToWip?: string | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/*
	 * PesReadOnly
	 */
	PesReadOnly?: boolean | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * PrjChangeStutasReadonly
	 */
	PrjChangeStutasReadonly?: boolean | null;

	/*
	 * PrjCostgroup1Fk
	 */
	PrjCostgroup1Fk?: number | null;

	/*
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/*
	 * PrjLocationReferenceFk
	 */
	PrjLocationReferenceFk?: number | null;

	/*
	 * ProgressInvoiceNo
	 */
	ProgressInvoiceNo?: number | null;

	/*
	 * QtoCommentFk
	 */
	QtoCommentFk?: number | null;

	/*
	 * QtoDetailCommentsEntities
	 */
	// QtoDetailCommentsEntities?: IQtoDetailCommentsEntity[] | null;

	/*
	 * QtoDetailContinuationFk
	 */
	QtoDetailContinuationFk?: number | null;

	/*
	 * QtoDetailDocumentEntities
	 */
	// QtoDetailDocumentEntities?: IQtoDetailDocumentEntity[] | null;

	/*
	 * QtoDetailGroupId
	 */
	QtoDetailGroupId?: number | null;

	/*
	 * QtoDetailReference
	 */
	QtoDetailReference?: string | null;

	/*
	 * QtoDetailReferenceFk
	 */
	QtoDetailReferenceFk?: number | null;

	/*
	 * QtoDetailSplitFromFk
	 */
	QtoDetailSplitFromFk?: number | null;

	/*
	 * QtoDetailSplitFromReference
	 */
	QtoDetailSplitFromReference?: string | null;

	/*
	 * QtoDetailStatusFk
	 */
	QtoDetailStatusFk: number;

	/*
	 * QtoFormula
	 */
	QtoFormula?: IQtoShareFormulaEntity | null;

	/*
	 * QtoFormulaFk
	 */
	QtoFormulaFk?: number | null;

	/*
	 * QtoHeaderFk
	 */
	QtoHeaderFk: number;

	/*
	 * QtoHeaderReadOnly
	 */
	QtoHeaderReadOnly?: boolean | null;

	/*
	 * QtoLineTypeCode
	 */
	QtoLineTypeCode?: string | null;

	/*
	 * QtoLineTypeFk
	 */
	QtoLineTypeFk: number;

	/*
	 * QtoSheetFk
	 */
	QtoSheetFk: number;

	/*
	 * QtoTypeFk
	 */
	QtoTypeFk?: number | null;

	/*
	 * Remark1Text
	 */
	Remark1Text?: string | null;

	/*
	 * RemarkText
	 */
	RemarkText?: string | null;

	/*
	 * Result
	 */
	Result: number;

	/*
	 * SortCode01Fk
	 */
	SortCode01Fk?: number | null;

	/*
	 * SortCode02Fk
	 */
	SortCode02Fk?: number | null;

	/*
	 * SortCode03Fk
	 */
	SortCode03Fk?: number | null;

	/*
	 * SortCode04Fk
	 */
	SortCode04Fk?: number | null;

	/*
	 * SortCode05Fk
	 */
	SortCode05Fk?: number | null;

	/*
	 * SortCode06Fk
	 */
	SortCode06Fk?: number | null;

	/*
	 * SortCode07Fk
	 */
	SortCode07Fk?: number | null;

	/*
	 * SortCode08Fk
	 */
	SortCode08Fk?: number | null;

	/*
	 * SortCode09Fk
	 */
	SortCode09Fk?: number | null;

	/*
	 * SortCode10Fk
	 */
	SortCode10Fk?: number | null;

	/*
	 * SourceBoqHeaderFk
	 */
	SourceBoqHeaderFk?: number | null;

	/*
	 * SourceBoqItemFk
	 */
	SourceBoqItemFk?: number | null;

	/*
	 * SourceQtoDetailId
	 */
	SourceQtoDetailId?: number | null;

	/*
	 * SpecialUse
	 */
	SpecialUse?: string | null;

	/*
	 * SplitItemBQReadOnly
	 */
	SplitItemBQReadOnly?: boolean | null;

	/*
	 * SplitItemIQReadOnly
	 */
	SplitItemIQReadOnly?: boolean | null;

	/*
	 * SplitNo
	 */
	SplitNo?: number | null;

	/*
	 * SubTotal
	 */
	SubTotal: number;

	/*
	 * TimeStr
	 */
	TimeStr?: string | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/*
	 * V
	 */
	V?: string | null;

	/*
	 * Value1
	 */
	Value1?: number | null;

	/*
	 * Value1Detail
	 */
	Value1Detail?: string | null;

	/*
	 * Value2
	 */
	Value2?: number | null;

	/*
	 * Value2Detail
	 */
	Value2Detail?: string | null;

	/*
	 * Value3
	 */
	Value3?: number | null;

	/*
	 * Value3Detail
	 */
	Value3Detail?: string | null;

	/*
	 * Value4
	 */
	Value4?: number | null;

	/*
	 * Value4Detail
	 */
	Value4Detail?: string | null;

	/*
	 * Value5
	 */
	Value5?: number | null;

	/*
	 * Value5Detail
	 */
	Value5Detail?: string | null;

	/*
	 * Vindex
	 */
	Vindex?: number | null;

	/*
	 * WipHeaderFk
	 */
	WipHeaderFk?: number | null;

	/*
	 * WipReadOnly
	 */
	WipReadOnly?: boolean | null;

	/*
	 * WorkCategoryFk
	 */
	WorkCategoryFk?: number | null;

	/*
	 * QtoStatusItem
	 */
	QtoStatusItem?: IQtoShareStatusEntity | null;

	// region initReadData: extend

	ignoreScriptValidation?: boolean | null;

	IsLineReferenceReadOnly?: boolean | null;

	OldQtoFormula?: IQtoShareFormulaEntity | null;

	Code?: string | null;

	HasError?: boolean | null;

	BoqSubItemFk?: number | null;
	BoqSubitemReferenceFk?: number | null;

	bakResult?: number | null;
	// endregion
}
