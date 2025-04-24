
import {ColumnDef, createLookup, FieldType, ILookupContext, ILookupFieldOverload} from '@libs/ui/common';
import {IBusinessPartnerBankEntity, ISupplierCompanyEntity} from '@libs/businesspartner/interfaces';
import {
	BasicsCompanyLookupService,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import {SupplierDataService} from '../../services/suppiler-data.service';
import { IBasicsCustomizePostingGroupEntity, IBasicsCustomizeSupplierLedgerGroupEntity, ICompanyEntity } from '@libs/basics/interfaces';
import {find} from 'lodash';
import {BusinesspartnerSharedBankLookupService} from '@libs/businesspartner/shared';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';

export const SUPPLIER_TO_COMPANY_COLUMNS: ColumnDef<ISupplierCompanyEntity>[] = [
	{
		id: 'CustomerNo',
		model: 'CustomerNo',
		type: FieldType.Description,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.customerNo'},
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
				execute(item: ICompanyEntity, context: ILookupContext<ICompanyEntity, ISupplierCompanyEntity>) {
					const subledgerContextId = context.injector.get(SupplierDataService).getSelectedEntity()?.SubledgerContextFk;
					return item.SubledgerContextFk === subledgerContextId;
				}
			}
		}),
		visible: true,
		sortable: true,
	},
	{
		id: 'SupplierLedgerGroupFk',
		model: 'SupplierLedgerGroupFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ledgerGroup'},
		width: 125,
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideSupplierLedgerGroupLookupOverload(true, {
			key: 'business-partner-main-supplierledgergroup-filter',
			execute(context: ILookupContext<IBasicsCustomizeSupplierLedgerGroupEntity, ISupplierCompanyEntity>) {
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
		},) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'VatGroupFk',
		model: 'VatGroupFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.vatGroup'},
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(true) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BusinessPostingGroupFk',
		model: 'BusinessPostingGroupFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.businessPostingGroup'},
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupLookupOverload(false,{key: 'business-partner-main-suppliercompany-businesspostinggroup-filter',
			execute(context: ILookupContext<IBasicsCustomizePostingGroupEntity, ISupplierCompanyEntity>) {
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
		},) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentTermPaFk',
		model: 'BasPaymentTermPaFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityPaymentTermPA'},
		width: 80,
		lookupOptions: (BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,	
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentTermFiFk',
		model: 'BasPaymentTermFiFk',
		type: FieldType.Lookup,
		label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityPaymentTermFI'},
		width: 80,
		lookupOptions: (BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BusinessPostGrpWhtFk',
		model: 'BusinessPostGrpWhtFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityBusinessPostGrpWht' },
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupWithholdingTaxLookupOverload(true) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	},
	{
		id: 'BasPaymentMethodFk',
		model: 'BasPaymentMethodFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityBasPaymentMethod' },
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
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
				key: 'business-partner-supplier-company-bank-filter',
				execute(context: ILookupContext<IBusinessPartnerBankEntity, ISupplierCompanyEntity>) {
					const supplierSelected = context.injector.get(SupplierDataService).getSelectedEntity();
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
		id: 'SupplierLedgerGroupIcFk',
		model: 'SupplierLedgerGroupIcFk',
		type: FieldType.Lookup,
		label: { key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ledgerGroupIcRecharging' },
		width: 125,
		lookupOptions: (BasicsSharedCustomizeLookupOverloadProvider.provideSupplierLedgerGroupLookupOverload(true, {
			key: 'business-partner-main-supplierledgergroup-filter',
			execute(context: ILookupContext<IBasicsCustomizeSupplierLedgerGroupEntity, ISupplierCompanyEntity>) {
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
		}) as ILookupFieldOverload<ISupplierCompanyEntity>).lookupOptions,
		visible: true,
		sortable: true,
	}
];
