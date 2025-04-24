/**
 * Copyright(c) RIB Software GmbH
 */

export interface ControllingActualsExcelImportEntity{
	/*
 * Code
 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;


	/*
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/*
	 * CompanyPeriod
	 */
	// CompanyPeriod?: ICompanyPeriodEntity | null;

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
	 * CompanyYear
	 */
	// CompanyYear?: ICompanyYearEntity | null;

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
	Id: number;

	/*
	 * IsFinal
	 */
	IsFinal?: boolean | null;

	/*
	 * LedgerContextFk
	 */
	LedgerContextFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * Total
	 */
	Total?: number | null;

	/*
	 * TotalOc
	 */
	TotalOc?: number | null;

	/*
	 * ValueTypeFk
	 */
	ValueTypeFk?: number | null;


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
	 * AmountProject
	 */
	AmountProject?: number | null;


	/*
	 * CompanyCostHeaderFk
	 */
	CompanyCostHeaderFk?: number | null;

	/*
	 * CompanyCurrencyFk
	 */
	CompanyCurrencyFk?: number | null;


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
	 * Quantity
	 */
	Quantity?: number | null;

	/*
	 * UomFk
	 */
	UomFk?: number | null;
}

export interface ControllingActualsExcelImportCustomEntity{
	Overwrite: boolean,
	CreateNew: boolean,
	UpdateOld: boolean,
	HomeCurrency: boolean,
	ForeignCurrency: boolean,
	NoteText: string
}