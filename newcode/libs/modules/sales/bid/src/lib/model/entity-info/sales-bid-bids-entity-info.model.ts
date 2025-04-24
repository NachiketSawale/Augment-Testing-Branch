/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';
import { SalesBidLabels } from '../sales-bid-labels.class';
import { SalesCommonLabels } from '@libs/sales/common';
import { IBidHeaderEntity  } from '@libs/sales/interfaces';

/**
 * Sales bid bids entity info
 */
export const SALES_BID_BIDS_ENTITY_INFO: EntityInfo = EntityInfo.create<IBidHeaderEntity> ({
    grid: {
        title: {key: 'sales.bid.containerTitleBids'},
    },
    form: {
    title: { key: 'sales.bid.containerTitleBidsForm' },
    containerUuid: '1918073bf2664785b1b9223c6e443d6d',
    },
    dataService: ctx => ctx.injector.get(SalesBidBidsDataService),
    dtoSchemeId: {moduleSubModule: 'Sales.Bid', typeName: 'BidHeaderDto'},
    permissionUuid: '7001204d7fb04cf48d8771c8971cc1e5',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: [
                    'TypeFk', 'DocumentType', 'RubricCategoryFk', 'ConfigurationFk', 'CompanyResponsibleFk', 'BillingSchemaFk', 'ProjectFk', 'EstHeaderFk',
                    'LanguageFk', 'BidStatusFk', 'Code', 'DescriptionInfo', 'CurrencyFk', 'ExchangeRate', 'ClerkFk',
                    'AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc',
                    'ContractTypeFk', 'OrdConditionFk', 'BidHeaderFk', 'ObjUnitFk', 'ControllingUnitFk', 'PrcStructureFk', 'DateEffective',
                    'PrcIncotermFk', 'BasSalesTaxMethodFk'],
            },
            {
                gid: 'Customer Data',
                attributes: ['BusinesspartnerFk', 'SubsidiaryFk', 'CustomerFk', 'BpdContactFk','BusinesspartnerBilltoFk', 'SubsidiaryBilltoFk', 'CustomerBilltoFk', 'ContactBilltoFk'],
            },
            {
                gid: 'paymentData',
                attributes: [
                    'PaymentTermFiFk', 'PaymentTermPaFk', 'TaxCodeFk', 'VatGroupFk'
                ]
            },
            {
                gid: 'datesData',
                attributes: [
                    'QuoteDate', 'PriceFixingDate', 'PlannedStart', 'PlannedEnd'
                ]
            },
            {
                gid: 'contractProbability',
                attributes: [
                    'OrdPrbltyPercent', //todo: ordprbltylastvaldateandwhoupd not available in IBidHeaderEntity
                ]
            },
            {
                gid: 'otherData',
                attributes: [
                    'PrjChangeFk', 'Remark', 'CommentText' //todo : prjchangestatusfk not available in IBidHeaderEntity
                ]
            },
            {
                gid: 'userDefText',
                attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
            },
            {
                gid: 'userDefDates',
                attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']
            },
        ],
        labels: {
                ...SalesBidLabels.getSalesBidLabels(),
                ...SalesCommonLabels.getSalesCommonLabels()
        },
        overloads: {
            TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBidTypeLookupOverload(true),
            RubricCategoryFk:BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
            BidStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideBidStatusLookupOverload(true),
            OrdConditionFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderConditionLookupOverload(true),
            CompanyResponsibleFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCompanyLookupService,
                    showDescription: true,
                    descriptionMember: 'CompanyName',
                }),
            },
            ConfigurationFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                }),
            },
            LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
            CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
            ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
            ContractTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
            ObjUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideObjectUnitTypeReadonlyLookupOverload(),
            ControllingUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideControllingUnitAssignmentReadonlyLookupOverload(),
            PrcStructureFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
            PrcIncotermFk: BasicsSharedLookupOverloadProvider.providePrcIncotermLookupOverload(true),
            BasSalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxMethodLookupOverload(false),
            AmountNet: {
                readonly: true,
            },
            AmountGross: {
                readonly: true,
            },
            AmountNetOc: {
                readonly: true,
            },
            AmountGrossOc: {
                readonly: true,
            },
            TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false),
            VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(false),
            PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(false),
            PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(false),
            //todo : DocumentType not available in IBidHeaderEntity
        },
    },
});