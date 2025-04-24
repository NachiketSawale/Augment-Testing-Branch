import { EntityInfo } from '@libs/ui/business-base';
import { BusinesspartnerMainCustomerOpenItemsDataService } from '../../services/customer-open-items-data.service';
import { CustomerOpenItemsLayoutService } from '../../services/layouts/customer-open-items-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICustomerOpenItemsEntity } from '@libs/businesspartner/interfaces';

export const CUSTOMER_OPEN_ITEMS_ENTITY_INFO = EntityInfo.create<ICustomerOpenItemsEntity>({
	grid: {
		title: { text: 'Customer Open Items', key: 'businesspartner.main.customerOpenItemGridContainerTitle' },
		containerUuid: '0a476775f47544f584c0c3db15433b13'
	},
	dataService: ctx => ctx.injector.get(BusinesspartnerMainCustomerOpenItemsDataService),
	permissionUuid: '53aa731b7da144cdbff201a7df205016',
	entitySchema: {
		schema: 'CustomerOpenItem',
		properties: {
			Customer_No: {domain: EntityDomainType.Description, mandatory: false},
			Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Amount_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			AuxiliaryIndex1: {domain: EntityDomainType.Description, mandatory: false},
			Credit_Amount: {domain: EntityDomainType.Decimal, mandatory: false},
			Credit_Amount_LCY: {domain: EntityDomainType.Decimal, mandatory: false},
			Currency_Code: {domain: EntityDomainType.Code, mandatory: false},
			Customer_Name: {domain: EntityDomainType.Description, mandatory: false},
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
			Salesperson_Code: {domain: EntityDomainType.Code, mandatory: false},
			Source_Code: {domain: EntityDomainType.Code, mandatory: false},
			Transaction_No: {domain: EntityDomainType.Integer, mandatory: false}
		}
	},
	layoutConfiguration: context => {
		return context.injector.get(CustomerOpenItemsLayoutService).generateLayout();
	}
});