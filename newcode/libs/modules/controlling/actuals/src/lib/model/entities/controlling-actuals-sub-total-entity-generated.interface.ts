/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IControllingActualsSubTotalEntityGenerated {
	/*
	 * AccountFk
	 */
	AccountFk?: number | null;

	/*
	 * Amount
	 */
	Amount?: number | null;

	/*
	 * AmountOc
	 */
	AmountOc?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * CompanyCostHeaderFk
	 */
	CompanyCostHeaderFk?: number | null;

	/*
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/*
	 * CompanyPeriodFk
	 */
	CompanyPeriodFk?: number | null;

	/*
	 * CompanyPeriodFkEndDate
	 */
	CompanyPeriodFkEndDate?: string | null;

	/*
	 * CompanyPeriodFkStartDate
	 */
	CompanyPeriodFkStartDate?: string | null;

	/*
	 * CompanyYearFk
	 */
	CompanyYearFk?: number | null;

	/*
	 * CompanyYearFkEndDate
	 */
	CompanyYearFkEndDate?: string | null;

	/*
	 * CompanyYearFkStartDate
	 */
	CompanyYearFkStartDate?: string | null;

	/*
	 * ContrCostCodeCode
	 */
	ContrCostCodeCode?: string | null;

	/*
	 * ContrCostCodeDescription
	 */
	// ContrCostCodeDescription?: IDescriptionTranslateType | null;

	/*
	 * ControllingUnitCode
	 */
	ControllingUnitCode?: string | null;

	/*
	 * ControllingUnitDescription
	 */
	// ControllingUnitDescription?: IDescriptionTranslateType | null;

	/*
	 * CurrencyFk
	 */
	CurrencyFk?: number | null;

	/*
	 * HasAccount
	 */
	HasAccount?: boolean | null;

	/*
	 * HasContCostCode
	 */
	HasContCostCode?: boolean | null;

	/*
	 * HasCostCode
	 */
	HasCostCode?: boolean | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsFinal
	 */
	IsFinal?: boolean | null;

	/*
	 * MdcContrCostCodeFk
	 */
	MdcContrCostCodeFk?: number | null;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * MdcCostCodeFk
	 */
	MdcCostCodeFk?: number | null;

	/*
	 * NominalDimension1
	 */
	NominalDimension1?: string | null;

	/*
	 * NominalDimension2
	 */
	NominalDimension2?: string | null;

	/*
	 * NominalDimension3
	 */
	NominalDimension3?: string | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity?: number | null;

	/*
	 * Total
	 */
	Total?: number | null;

	/*
	 * TotalOc
	 */
	TotalOc?: number | null;

	/*
	 * UomFk
	 */
	UomFk?: number | null;

	/*
	 * ValueTypeFk
	 */
	ValueTypeFk?: number | null;
}
