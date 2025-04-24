/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedQuotationStatusLookupService } from '@libs/basics/shared';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { IQuote2RfqVEntity, IQuoteByRequestLayout, QUOTE_BY_REQUEST_LAYOUT_TOKEN } from '@libs/procurement/interfaces';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';

/**
 * Service to prepare the layout for quote container.
 */
@LazyInjectable({
    token: QUOTE_BY_REQUEST_LAYOUT_TOKEN,
    useAngularInjection: true
})
@Injectable({
    providedIn: 'root'
})
export class QuoteByRequestLayoutService implements IQuoteByRequestLayout {

    /**
     * Prepares the layout for quote container.
     * @returns An object of ILayoutConfiguration<IQuote2RfqVEntity>
     */
    public generateLayout(): ILayoutConfiguration<IQuote2RfqVEntity> {
        return {
            groups: [
                {
                    gid: 'default-group',
                    attributes: ['RfqDescription', 'Code', 'QtnDescription', 'QtnStatusFk', 'QtnValueNet', 'QtnValueNetOc',
                        'QtnValueTax', 'QtnValueTaxOc', 'QtnVersion', 'ExchangeRate',
                        'BpName1', 'BpName2', 'BpName3', 'BpName4', 'IsMainAddress', 'Subsidiary',
                        'SubsidiaryAddress', 'SubsidiaryTelephone', 'SubsidiaryTelefax', 'SubsidiaryMobileNo',
                        'SupplierCode', 'DateQuoted', 'DateReceived', 'DatePricefixing', 'BusinesspartnerEmail'
                    ]
                },
            ],
            overloads: {
                QtnStatusFk: {
                    type: FieldType.Lookup,
                    readonly: true,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedQuotationStatusLookupService
                    })
                },
            },
            labels: {
                ...prefixAllTranslationKeys('procurement.quote.', {
                    QtnVersion: { key: 'headerVersion', text: 'Version' },
                    DatePricefixing: { key: 'headerDataPricefixing', text: 'Date Price Fixing' },
                    DateQuoted: { key: 'headerDateQuoted', text: 'Quote' },
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    Code: { key: 'entityCode', text: 'Code' },
                    QtnDescription: { key: 'entityDescription', text: 'Description' },
                    QtnStatusFk: { key: 'entityState', text: 'Status' },
                    DateReceived: { key: 'entityReceived', text: 'Date Received' },
                    QtnValueNet: { key: 'reqTotalValueNet', text: 'Net Value' },
                    QtnValueNetOc: { key: 'reqTotalValueNetOc', text: 'Net Value (OC)' },
                    QtnValueTax: { key: 'reqTotalValueTax', text: 'VAT' },
                    QtnValueTaxOc: { key: 'reqTotalValueTaxOc', text: 'VAT (OC)' },
                    ExchangeRate: { key: 'entityRate', text: 'Exchange Rate' },
                    Subsidiary: { key: 'entitySubsidiary', text: 'Branch' },
                    SubsidiaryAddress: { 'key': 'entityAddress', 'text': 'Address' },
                    SubsidiaryTelephone: { key: 'TelephoneDialogPhoneNumber', text: 'Phone Number' },
                    SubsidiaryTelefax: { key: 'fax', text: 'Telefax' },
                    SubsidiaryMobileNo: { key: 'mobile', text: 'Mobile' },
                    BpName1: { text: 'Business Partner Name1', key: 'entityBusinessPartnerName1' },
                    BpName2: { text: 'Business Partner Name2', key: 'entityBusinessPartnerName2' },
                    BpName3: { text: 'Business Partner Name1', key: 'entityBusinessPartnerName1' },
                    BpName4: { text: 'Business Partner Name2', key: 'entityBusinessPartnerName2' },
                }),
                ...prefixAllTranslationKeys('procurement.requisition.', {
                    RfqDescription: { 'key': 'headerGrid.rfqDescription', text: 'RFQ Description' },
                }),
                ...prefixAllTranslationKeys('businesspartner.main.', {
                    IsMainAddress: { 'key': 'isMainAddress', text: 'Is Main Address' },
                    SupplierCode: { 'key': 'supplierCode', text: 'Supplier No.' },
                    BusinesspartnerEmail: { 'key': 'email', text: 'Email' },
                }),
            }
        };
    }
}