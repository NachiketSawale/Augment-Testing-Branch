import {EntityInfo} from '@libs/ui/business-base';

import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsShareControllingUnitLookupService} from '@libs/basics/shared';
import {inject} from '@angular/core';
import {ProcurementShareContractLookupService} from '@libs/procurement/shared';
import {IGccPrcInvoicesEntity} from './entities/gcc-prc-invoices-entity.interface';
import {
    ControllingGeneralContractorPrcInvoicesBehavior
} from '../behaviors/controlling-general-contractor-prc-invoices-behavior.service';
import {
    ControllingGeneralContractorPrcInvoicesDataService
} from '../services/controlling-general-contractor-prc-invoices-data.service';
import {
    BusinessPartnerLookupService,
    BusinesspartnerSharedSupplierLookupService,
} from '@libs/businesspartner/shared';

export const ControllingGeneralContractorPrcInvoiceEntityInfo: EntityInfo = EntityInfo.create<IGccPrcInvoicesEntity> ({
    grid: {
        title: {text: 'PRC Invoices', key: 'controlling.generalcontractor.PRCInvoicesTitle'},
        containerUuid:'9fe07bf7c81e4d45a680400d5aa47c23',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorPrcInvoicesBehavior),
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorPrcInvoicesDataService),
    dtoSchemeId: {moduleSubModule: 'Controlling.GeneralContractor', typeName: 'InvHeaderCompeleteDto'},
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['Code','AmountNet', 'BpdBusinesspartnerFk', 'BpdSupplierFk',  'ConHeaderFk', 'Description', 'InvTypeFk','InvoiceStatusFk','MdcControllingUnitFk','PaymentDate']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code :{key:'Code',text:'Code'},
                AmountNet :{key:'Amount',text:'Amount(Net)'},
                MdcControllingUnitFk :{key:'entityControllingUnit',text:'Controlling Unit'},
                ConHeaderFk :{key:'ConHeaderFk',text:'Contract'},
                Description :{key:'Description',text:'Description'},
                InvTypeFk :{key:'invTypeFk',text:'Type'},
                InvoiceStatusFk :{key:'InvoiceStatusFk',text:'Invoice Status'},
                PaymentDate :{key:'PaymentDate',text:'Payment Date'},
                BpdBusinessPartnerFk: {key: 'bpdBusinesspartnerFk',text: 'Business Partner'}
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                BpdSupplierFk: {key: 'entitySupplierCode', text: 'Supplier No.'},
            })
        },
        overloads: {
            Code :{ readonly:true},
            AmountNet :{ readonly:true},
            MdcControllingUnitFk :{
                readonly:true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsShareControllingUnitLookupService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    serverSideFilter: {
                        key: 'controlling-actuals-controlling-unit-filter',
                        execute: context => {
                            return {
                                ByStructure: true,
                                ExtraFilter: false,
                                CompanyFk: inject(PlatformConfigurationService).getContext().clientId,
                                FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
                                IsProjectReadonly: true,
                                IsCompanyReadonly: true
                            };
                        }
                    },
                    selectableCallback: e => {
                        return true;
                    }
                })
            },
            ConHeaderFk :{
                readonly:true,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementShareContractLookupService,
                    showDescription: true,
                    descriptionMember: 'Description'
                })
            },
            BpdBusinesspartnerFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinessPartnerLookupService
                })
            },
            Description :{readonly:true},
            BpdSupplierFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinesspartnerSharedSupplierLookupService,
                    showClearButton: true
                })
            },
            PaymentDate:{
                readonly:true
            },
            InvTypeFk:{
                // lookup to do by LQ
                readonly:true
            },
            InvoiceStatusFk:{
                // lookup to do by LQ
                readonly:true
            }
        }
    }
});