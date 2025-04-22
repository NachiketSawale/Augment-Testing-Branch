import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICustomerOpenItemsEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class CustomerOpenItemsLayoutService {
	public generateLayout() : ILayoutConfiguration<ICustomerOpenItemsEntity> {
		return {
			suppressHistoryGroup: false,
			groups: [
				{
					'gid' : 'basicData',
					attributes: [ 'Customer_No', 'Amount', 'Amount_LCY', 'AuxiliaryIndex1', 'Credit_Amount', 'Credit_Amount_LCY', 'Currency_Code', 'Customer_Name', 'Debit_Amount', 'Debit_Amount_LCY', 'Dimension_Set_ID', 'Document_Date', 'Document_No', 'Document_Type', 'Due_Date', 'IC_Partner_Code', 'Open', 'Original_Amt_LCY', 'Pmt_Discount_Date', 'Posting_Date', 'Reason_Code', 'Remaining_Amount', 'Remaining_Amt_LCY', 'Salesperson_Code', 'Source_Code', 'Transaction_No' ]
				}
			],
			labels: {
				...prefixAllTranslationKeys('businesspartner.main.openItem.', {
					'Customer_No': {key: 'customerNo', text: 'Customer No.'},
					'Amount': { key: 'amount', text: 'Amount'},
					'Amount_LCY': { key: 'amountLCY', text: 'Amount LCY'},
					'AuxiliaryIndex1': { key: 'auxiliaryIndex1'},
					'Credit_Amount': { key: 'creditAmount'},
					'Credit_Amount_LCY': { key: 'creditAmountLCY'},
					'Currency_Code': { key: 'currencyCode'},
					'Customer_Name': { key: 'customerName'},
					'Debit_Amount': { key: 'debitAmount'},
					'Debit_Amount_LCY': { key: 'debitAmountLCY'},
					'Dimension_Set_ID': { key: 'dimensionSetID'},
					'Document_Date': { key: 'documentDate'},
					'Document_No': { key: 'documentNo'},
					'Document_Type': { key: 'documentType'},
					'Due_Date': { key: 'dueDate'},
					'IC_Partner_Code': { key: 'ICPartnerCode'},
					'Open': { key: 'open'},
					'Original_Amt_LCY': { key: 'originalAmtLCY'},
					'Pmt_Discount_Date': { key: 'pmtDiscountDate'},
					'Posting_Date': { key: 'postingDate'},
					'Reason_Code': { key: 'reasonCode'},
					'Remaining_Amount': { key: 'remainingAmount'},
					'Remaining_Amt_LCY': { key: 'remainingAmountLcy'},
					'Salesperson_Code': { key: 'salespersonCode'},
					'Source_Code': { key: 'sourceCode'},
					'Transaction_No': { key: 'transactionNO'}
				})
			}
		};
	}
}