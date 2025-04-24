/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType } from '@libs/ui/common';
import { EntityInfo } from '@libs/ui/business-base';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { SalesCommonBillLookupService, SalesCommonContractLookupService } from '@libs/sales/shared';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { SalesBillingLabels } from '../sales-billing-labels.class';
import { SalesCommonLabels } from '@libs/sales/common';

/**
 * Sales billing bills entity info
 */
export const SALES_BILLING_BILLS_ENTITY_INFO: EntityInfo = EntityInfo.create<IBilHeaderEntity> ({
    grid: {
        title: {key: 'sales.billing.containerTitleBills'},
    },
    form: {
        title: { key: 'sales.billing.containerTitleBillsForm' },
        containerUuid: 'e66e01dcb9d94aa889f0a8de3a16a65a',
    },
    dataService: ctx => ctx.injector.get(SalesBillingBillsDataService),
    dtoSchemeId: {moduleSubModule: 'Sales.Billing', typeName: 'BilHeaderDto'},
    permissionUuid: '39608924dc884afea59fe04cb1434543',
    layoutConfiguration: {
        groups:[
            {
                gid: 'basicData',
                title: {
                    text: 'Basic Data',
                    key: 'cloud.common.entityProperties'
                },
                attributes: ['TypeFk', 'RubricCategoryFk', 'ConfigurationFk', 'CompanyResponsibleFk', 'CompanyIcDebtorFk','BillingSchemaFk', 'ProjectFk','LanguageFk', 'BilStatusFk', 'BillDate', 'DatePosted', 'BillNo', 'ConsecutiveBillNo', 'ProgressInvoiceNo', 'ReferenceStructured', 'InvoiceTypeFk','DescriptionInfo', 'CurrencyFk', 'ExchangeRate', 'BankTypeFk', 'BankFk', 'ClerkFk', 'ContractTypeFk', 'OrdConditionFk','AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc','IsCanceled', 'CancellationNo', 'CancellationReason', 'CancellationDate','BookingText', 'OrdHeaderFk', 'PreviousBillFk', 'RelatedBillHeaderFk', 'ObjUnitFk', 'ControllingUnitFk', 'PrcStructureFk', 'DateEffective', 'DocumentNo','BasSalesTaxMethodFk','IsNotAccrual']
            },
            {
                gid: 'customerData',
                attributes: ['BusinesspartnerFk', 'SubsidiaryFk', 'CustomerFk', 'ContactFk','BusinesspartnerBilltoFk', 'SubsidiaryBilltoFk', 'CustomerBilltoFk', 'ContactBilltoFk']
            },
            {
                gid: 'paymentData',
                attributes: ['DateDiscount', 'DateNetpayable', 'PaymentTermFk',
                    'TaxCodeFk','VatGroupFk', 'AmountTotal', 'DiscountAmountTotal', 'PaymentScheduleCode']
            },
            {
                gid: 'datesData',
                attributes: ['PerformedFrom', 'PerformedTo']
            },
            {
                gid: 'otherData',
                attributes: ['Remark', 'CommentText','PrjChangeFk']
                //todo - prjchangestatusfk not available in generated DTO
            },
            {
                gid: 'userDefText',
                attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
            },
            {
                gid: 'userDefDates',
                attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']
            }
            
        ],
        labels: {
            ...SalesBillingLabels.getSalesBillingLabels(),
            ...SalesCommonLabels.getSalesCommonLabels()
        },
        overloads: {
            TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillTypeLookupOverload(false),
            BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(false),
            RubricCategoryFk:BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceTypeReadonlyLookupOverload(),
            BilStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillStatusReadonlyLookupOverload(),
            InvoiceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceTypeLookupOverload(false),
            TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
            OrdConditionFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderConditionLookupOverload(true),
            BankTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBankTypeReadonlyLookupOverload(),
            PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
            LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideUserInterfaceLanguageLookupOverload(false),
            CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(false),
            ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false),
            ContractTypeFk: BasicsSharedLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
            ObjUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideObjectUnitTypeReadonlyLookupOverload(),
            PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
            BasSalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxMethodLookupOverload(false),
            CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
            BusinesspartnerBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfqBusinessPartnerStatusLookupOverload(true),
            CustomerBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(false),
            ContactBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactRoleLookupOverload(false),
            ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectGroupReadonlyLookupOverload(),
            BankFk: BasicsSharedCustomizeLookupOverloadProvider.provideBankTypeLookupOverload(true),
            VatGroupFk:BasicsSharedLookupOverloadProvider.provideVATGroupLookupOverload(true),
            ContactFk:BasicsSharedCustomizeLookupOverloadProvider.provideContactRoleLookupOverload(true),
            ControllingUnitFk:BasicsSharedCustomizeLookupOverloadProvider.provideControllingUnitAssignmentReadonlyLookupOverload(),
            SubsidiaryBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerBranchLookupOverload(true),
            PrjChangeFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
					dataServiceToken: ProcurementShareProjectChangeLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
					showClearButton: true
				})
            },
            SubsidiaryFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService
                })
            },
            CompanyResponsibleFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCompanyLookupService,
                    showDescription: true,
                    descriptionMember: 'CompanyName',
                }),
            },
            BusinesspartnerFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinessPartnerLookupService,
                    displayMember: 'BusinessPartnerName1',
                    showClearButton: false
                })
            },
            ConfigurationFk:{
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                }),
            },
            OrdHeaderFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: SalesCommonContractLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                }),
            },
            PreviousBillFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: SalesCommonBillLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                }),
            },
            RelatedBillHeaderFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: SalesCommonBillLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                    //TODO : later to add serverSideFilter
                }),
                
            },
            CompanyIcDebtorFk:{
                // TODO - depend on sales.common lookup
            },
            DocumentNo: {
                readonly: true,
            },
            AmountNet: {
                readonly: true
            },
            AmountNetOc: {
                readonly: true
            },
            AmountGross: {
                readonly: true
            },
            AmountGrossOc: {
                readonly: true
            },
            AmountTotal:{
                readonly: true
            },
            DiscountAmountTotal: {
                readonly: true
            },
            BillNo: {
                readonly: true
            },
            ConsecutiveBillNo:{
                readonly: true
            },
            ProgressInvoiceNo: {
                readonly: true
            }
        }
    }
});