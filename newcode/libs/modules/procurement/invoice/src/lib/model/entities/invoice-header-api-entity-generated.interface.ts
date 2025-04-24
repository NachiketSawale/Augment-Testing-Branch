/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInvoiceHeaderApiEntityGenerated {
	/*
	 * AmountNet
	 */
	AmountNet: number;

	/*
	 * AmountNetGross
	 */
	AmountNetGross: number;

	/*
	 * CompanyCode
	 */
	CompanyCode?: string | null;

	/*
	 * ContractCode
	 */
	ContractCode?: string | null;

	/*
	 * Currency
	 */
	Currency?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/*
	 * InvoiceDate
	 */
	InvoiceDate: Date | string;

	/*
	 * InvoiceHeaderId
	 */
	InvoiceHeaderId: number;

	/*
	 * PesHeaderId
	 */
	PesHeaderId: number;

	/*
	 * Reference
	 */
	Reference?: string | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * ShipmentNumber
	 */
	ShipmentNumber?: string | null;

	/*
	 * TaxCode
	 */
	TaxCode?: string | null;
}
