/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';

export class SalesBidLabels{
    public static getSalesBidLabels() {
        return {
            ...prefixAllTranslationKeys('sales.bid.', {
                TypeFk: { key: 'entityBidTypeFk', text: 'Type' },
                BidStatusFk: { key: 'entityBidStatusFk', text: 'BidStatusFk' },
                QuoteDate: { key: 'entityQuoteDate', text: 'QuoteDate' },
                BidHeaderFk: { key: 'entityBidHeaderFk', text: 'BidHeaderFk' },
                DocumentType: { key: 'entityDocumentType', text: 'Document Type' },
                contractProbability: { key: 'contractProbability', text: 'Contract Probability' },
                OrdPrbltyPercent: { key: 'entityOrdPrbltyPercent', text: 'Contract Probability (in %)' },
                OrdPrbltyLastvalDateAndWhoupd: { key: 'entityOrdPrbltyLastvalDateAndWhoupd', text: 'Last Valuation' },
                PrcTexttypeFk: { key: 'headerText.prcTextType', text: 'Text Type'},
                BasTextModuleTypeFk: { key: 'bastextmoduletype', text: 'Text Module Type'},
            }),
            ...prefixAllTranslationKeys('sales.billing.', {
                AmountNet: { key: 'entityAmountNet', text: 'Net Amount' },
                AmountGross: { key: 'entityAmountGross', text: 'Gross Amount' },
                AmountNetOc: { key: 'entityAmountNetOc', text: 'Net Amount Oc' },
                AmountGrossOc: { key: 'entityAmountGrossOc', text: 'Gross Amount Oc' },
                BasSalesTaxMethodFk: {key: 'entityBasSalesTaxMethodFk', text: 'Sales Tax Method'},
            }),
            ...prefixAllTranslationKeys('basics.billingschema.', {
                CredFactor: { key: 'credFactor', text: 'Cred Factor'},
                DebFactor: { key: 'debFactor', text: 'Deb Factor'},
                DetailAuthorAmountFk: { key: 'billingschmdtlaafk', text: 'Author.Amount Ref'},
                BillingSchemaDetailTaxFk: { key: 'billingSchmDtlTaxFk', text: 'Tax Ref'},
                CredLineTypeFk: { key: 'creditorlinetype', text: 'Treatment Cred'},
                DebLineTypeFk: { key: 'debitorlinetype', text: 'Treatment Deb'},
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                baseGroup: { key: 'entityProperties', text: 'Basic Data'},
                PrcIncotermFk: {key: 'entityIncoterms', text: '*Incoterms'}
            }),
            ...prefixAllTranslationKeys('estimate.main.', {
                EstHeaderFk: { key: 'estHeaderFk', text: 'Estimate' },
            }),
            ...prefixAllTranslationKeys('basics.common.', {
                DateEffective:{ key: 'dateEffective', text: 'Date Effective'},
            }),
            ...prefixAllTranslationKeys('project.main.', {
                BpdContactFk: { key: 'entityContact', text: '*Contact'},
            }),  
        };          
    }
}

