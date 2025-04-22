/*
 * Copyright(c) RIB Software GmbH
 */

export interface ITransactionParamEntityGenerated {
	/*
	 * Abbreviation
	 */
	Abbreviation?: string | null;

	/*
	 * AccrualModeId
	 */
	AccrualModeId: number;

	/*
	 * Comment
	 */
	Comment?: string | null;

	/*
	 * CompanyPeriodId
	 */
	CompanyPeriodId: number;

	/*
	 * CompanyYearId
	 */
	CompanyYearId: number;

	/*
	 * EffectiveDate
	 */
	EffectiveDate: Date | string;

	/*
	 * PostingNarrative
	 */
	PostingNarrative?: string | null;

	/*
	 * TransactionTypeId
	 */
	TransactionTypeId: number;

	/*
	 * UseCompanyNumber
	 */
	UseCompanyNumber: boolean;

	/*
	 * VoucherNo
	 */
	VoucherNo?: string | null;
}
