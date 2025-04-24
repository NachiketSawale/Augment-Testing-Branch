import {EntityInfo} from '@libs/ui/business-base';
import {
    ControllingGeneralContractorPrcContractsDataService
} from '../services/controlling-general-contractor-prc-contracts-data.service';
import {
    ControllingGeneralContractorPrcContractsBehaviorService
} from '../behaviors/controlling-general-contractor-prc-contracts-behavior.service';
import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {IPrcContractsEntity} from './entities/prc-contracts-entity.interface';
import {createLookup, FieldType} from '@libs/ui/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedConStatusLookupService } from '@libs/basics/shared';
import {inject} from '@angular/core';
import {
    BusinessPartnerLookupService,
    BusinesspartnerSharedSupplierLookupService
} from '@libs/businesspartner/shared';
import { IBasicsCustomizeConStatusEntity } from '@libs/basics/interfaces';


export const controllingGeneralContractorPrcContractsEntityInfo : EntityInfo = EntityInfo.create<IPrcContractsEntity>({
    grid: {
        title: {text: 'PRC Contracts', key: 'controlling.generalcontractor.PrcContractsTile'},
        containerUuid: 'c5969b77708e4e70b2baca4ad802a3f4',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorPrcContractsBehaviorService),
    },

    dtoSchemeId: {
        moduleSubModule: 'Controlling.GeneralContractor',
        typeName: 'PrcContractsDto'
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorPrcContractsDataService),
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration: {
        groups: [
            {
                gid: 'baseGroup',
                attributes: ['Code', 'Description', 'ConStatusFk', 'PrjChangeFk', 'Total', 'MdcControllingUnitFk',
                    'BusinesspartnerFk', 'SupplierFk']
            }
        ],
        labels:{
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code :{
                    key :'Code',
                    text:'Code'
                },
                Description :{
                    key :'Description',
                    text:'Description'
                },
                ConStatusFk :{
                    key :'ConStatusFk',
                    text:'Contract Status'
                },
                PrjChangeFk :{
                    key :'PrjChangeFk',
                    text:'Change'
                },
                Total :{
                    key :'Total',
                    text:'Total'
                },
                MdcControllingUnitFk :{
                    key :'ControllingUnitFk',
                    text:'Controlling Unit'
                },
                BusinesspartnerFk :{
                    key :'entityBusinessPartner',
                    text:'Business Partner'
                },
                SupplierFk :{
                    key :'entitySupplierCode',
                    text:'Supplier'
                }
            }),...prefixAllTranslationKeys('cloud.common.', {
                BusinesspartnerFk :{
                    key :'entityBusinessPartner',
                    text:'Business Partner'
                },
                SupplierFk :{
                    key :'entitySupplierCode',
                    text:'Supplier'
                }
            }),
        },
        overloads:{
            Code :{ readonly:true},
            Description :{ readonly:true},
            ConStatusFk :{
                readonly:true,
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPrcContractsEntity, IBasicsCustomizeConStatusEntity>({
                    dataServiceToken: BasicsSharedConStatusLookupService,
                })
            },
            PrjChangeFk :{
                readonly:true,
                //TODO: waiting for project-change-dialog
            },
            Total :{ readonly:true},
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
                })},
            BusinesspartnerFk : {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinessPartnerLookupService,
                    displayMember: 'BusinessPartnerName1',
                })
            },
            SupplierFk :{
                readonly:true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BusinesspartnerSharedSupplierLookupService,
                    showClearButton: true,
                })
            }

        }
    }
});