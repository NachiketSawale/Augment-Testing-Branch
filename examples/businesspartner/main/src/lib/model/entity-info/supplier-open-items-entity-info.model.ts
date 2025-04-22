import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { BusinesspartnerMainSupplierOpenItemsDataService } from '../../services/supplier-open-items-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { ISupplierOpenItemsEntity } from '@libs/businesspartner/interfaces';

export const SUPPLIER_OPEN_ITEMS_ENTITY_INFO = EntityInfo.create<ISupplierOpenItemsEntity>({
	grid: {
		title: { text: 'Supplier Open Items', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.supplierOpenItemGridContainerTitle' },
		containerUuid: 'ec88cb1b43ee45508e1dd867cb2953a7'
	},
	dataService: ctx => ctx.injector.get(BusinesspartnerMainSupplierOpenItemsDataService),
	permissionUuid: '7f5057a88b974acd9fb5a00cee60a33d',
	entitySchema: {
		schema: 'SupplierOpenItem',
		properties: {
			Vendor_No: {domain: EntityDomainType.Description, mandatory: false},
			Vendor_Name: {domain: EntityDomainType.Description, mandatory: false},
			Purchaser_Code: {domain: EntityDomainType.Code, mandatory: false},
			Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Amount_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			AuxiliaryIndex1: {domain: EntityDomainType.Description, mandatory: false},
			Credit_Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Credit_Amount_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			Currency_Code: {domain: EntityDomainType.Code, mandatory: false},
			Debit_Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Debit_Amount_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			Dimension_Set_ID: {domain: EntityDomainType.Description, mandatory: false},
			Document_Date: {domain: EntityDomainType.Date, mandatory: false},
			Document_No: {domain: EntityDomainType.Description, mandatory: false},
			Document_Type: {domain: EntityDomainType.Description, mandatory: false},
			Due_Date: {domain: EntityDomainType.Date, mandatory: false},
			IC_Partner_Code: {domain: EntityDomainType.Code, mandatory: false},
			Open: {domain: EntityDomainType.Boolean, mandatory: false},
			Original_Amt_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			Pmt_Discount_Date: {domain: EntityDomainType.Date, mandatory: false},
			Posting_Date: {domain: EntityDomainType.Date, mandatory: false},
			Reason_Code: {domain: EntityDomainType.Code, mandatory: false},
			Remaining_Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Remaining_Amt_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			Source_Code: {domain: EntityDomainType.Code, mandatory: false},
			Transaction_No: {domain: EntityDomainType.Integer, mandatory: false}
		}
	},
	layoutConfiguration: {
		suppressHistoryGroup: false,
		groups: [
			{
				'gid' : 'basicData',
				attributes: [ 'Vendor_No', 'Amount', 'Amount_LCY', 'AuxiliaryIndex1', 'Credit_Amount', 'Credit_Amount_LCY', 'Currency_Code', 'Vendor_Name', 'Debit_Amount', 'Debit_Amount_LCY', 'Dimension_Set_ID', 'Document_Date', 'Document_No', 'Document_Type', 'Due_Date', 'IC_Partner_Code', 'Open', 'Original_Amt_LCY', 'Pmt_Discount_Date', 'Posting_Date', 'Reason_Code', 'Remaining_Amount', 'Remaining_Amt_LCY', 'Purchaser_Code', 'Source_Code', 'Transaction_No' ]
			}
		],
		labels: {
			...prefixAllTranslationKeys('businesspartner.main.openItem.', {
				'Vendor_No': {key: 'vendorNo', text: 'Customer No.'},
				'Vendor_Name': { key: 'vendorName'},
				'Purchaser_Code': { key: 'purchaserCode'},
				'Amount': { key: 'amount', text: 'Amount'},
				'Amount_LCY': { key: 'amountLCY', text: 'Amount LCY'},
				'AuxiliaryIndex1': { key: 'auxiliaryIndex1'},
				'Credit_Amount': { key: 'creditAmount'},
				'Credit_Amount_LCY': { key: 'creditAmountLCY'},
				'Currency_Code': { key: 'currencyCode'},
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
				'Source_Code': { key: 'sourceCode'},
				'Transaction_No': { key: 'transactionNO'}
			})
		}
	}
});