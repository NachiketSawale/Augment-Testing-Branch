import {ColumnDef, createLookup, FieldType, ILookupContext, ILookupFieldOverload} from '@libs/ui/common';
import {
	BasicsCompanyLookupService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import {
	IBasicsCustomizeCustomerLedgerGroupEntity,
	IBasicsCustomizePostingGroupEntity, ICompanyEntity,
} from '@libs/basics/interfaces';
import {find} from 'lodash';
import {BusinesspartnerSharedBankLookupService} from '@libs/businesspartner/shared';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {BusinesspartnerMainCustomerDataService} from '../../services/customer-data.service';
import { IBusinessPartnerBankEntity, ICustomerCompanyEntity } from '@libs/businesspartner/interfaces';

export const CUSTOMER_TO_COMPANY_COLUMNS: ColumnDef<ICustomerCompanyEntity>[] = [
	{
		id: 'Supplierno',
		model: 'Supplierno',
		type: FieldType.Description,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.supplierNo'},
		visible: true,
		sortable: true,
	},
	{
		id: 'BasCompanyFk',
		model: 'BasCompanyFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCompany'},
		lookupOptions: createLookup({
			dataServiceToken: BasicsCompanyLookupService,
			clientSideFilter: {
				execute(item: ICompanyEntity, context: ILookupContext<ICompanyEntity, ICustomerCompanyEntity>) {
					const subledgerContextId = context.injector.get(BusinesspartnerMainCustomerDataService).getSelectedEntity()?.SubledgerContextFk;
					return item.SubledgerContextFk === subledgerContextId;
				}
			}
		}),
		visible: true,
		sortable: true,
	},
	{
		id: 'CustomerLedgerGroupFk',
		model: 'CustomerLedgerGroupFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ledgerGroup'},
		width: 125,
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideCustomerLedgerGroupLookupOverload(true, {
			key: 'business-partner-main-customerledgergroup-filter',
			execute(context: ILookupContext<IBasicsCustomizeCustomerLedgerGroupEntity, ICustomerCompanyEntity>) {
				if (!context.entity?.BasCompanyFk) {
					return {
						BpdSubledgerContextFk: null
					};
				}
				const companies = context.injector.get(BasicsCompanyLookupService).syncService?.getListSync();
				const company = find(companies, data => {
					return data.Id === context.entity?.BasCompanyFk;
				});
				return {
					BpdSubledgerContextFk: company ? company.SubledgerContextFk : null
				};
			},
		},) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'VatGroupFk',
		model: 'VatGroupFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.vatGroup' },
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(true) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BusinessPostingGroupFk',
		model: 'BusinessPostingGroupFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.businessPostingGroup' },
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupLookupOverload(true, {
			key: 'business-partner-main-businesspostinggroup-filter',
			execute(context: ILookupContext<IBasicsCustomizePostingGroupEntity, ICustomerCompanyEntity>) {
				if (!context.entity?.BasCompanyFk) {
					return {
						BpdSubledgerContextFk: null
					};
				}
				const companies = context.injector.get(BasicsCompanyLookupService).syncService?.getListSync();
				const company = find(companies, data => {
					return data.Id === context.entity?.BasCompanyFk;
				});
				return {
					BpdSubledgerContextFk: company ? company.SubledgerContextFk : null
				};
			},
		}) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentTermPaFk',
		model: 'BasPaymentTermPaFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityPaymentTermPA' },
		width: 80,
		lookupOptions: (BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentTermFiFk',
		model: 'BasPaymentTermFiFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityPaymentTermFI' },
		width: 80,
		lookupOptions: (BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentMethodFk',
		model: 'BasPaymentMethodFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityBasPaymentMethod' },
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BankFk',
		model: 'BankFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityBankName' },
		lookupOptions: createLookup({
			dataServiceToken: BusinesspartnerSharedBankLookupService,
			displayMember: 'BankIbanWithName',
			disableInput: true,
			serverSideFilter: {
				key: 'business-partner-customer-company-bank-filter',
				execute(context: ILookupContext<IBusinessPartnerBankEntity, ICustomerCompanyEntity>) {
					const supplierSelected = context.injector.get(BusinesspartnerMainCustomerDataService).getSelectedEntity();
					return {
						BusinessPartnerFk: supplierSelected?.BusinessPartnerFk
					};
				},
			}
		}),
		visible: true,
		sortable: true,
	},
	{
		id: 'CustomerLedgerGroupIcFk',
		model: 'CustomerLedgerGroupIcFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ledgerGroupIcRecharging' },
		width: 125,
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideCustomerLedgerGroupLookupOverload(true, {
			key: 'business-partner-main-customerledgergroup-filter',
			execute(context: ILookupContext<IBasicsCustomizeCustomerLedgerGroupEntity, ICustomerCompanyEntity>) {
				if (!context.entity?.BasCompanyFk) {
					return {
						BpdSubledgerContextFk: null
					};
				}
				const companies = context.injector.get(BasicsCompanyLookupService).syncService?.getListSync();
				const company = find(companies, data => {
					return data.Id === context.entity?.BasCompanyFk;
				});
				return {
					BpdSubledgerContextFk: company ? company.SubledgerContextFk : null
				};
			},
		}) as ILookupFieldOverload<ICustomerCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	}
];
