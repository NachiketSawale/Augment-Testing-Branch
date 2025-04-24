import {EntityInfo} from '@libs/ui/business-base';
import {IGccAddExpenseEntity} from './entities/gcc-add-expense-entity.interface';

import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {
    ControllingGeneralContractorAddExpensesDataService
} from '../services/controlling-general-contractor-add-expenses-data.service';
import {
    ControllingGeneralContractorAddExpensesBehavior
} from '../behaviors/controlling-general-contractor-add-expenses-behavior.service';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsShareControllingUnitLookupService} from '@libs/basics/shared';
import {inject} from '@angular/core';
import {ProcurementPackageLookupService, ProcurementShareContractLookupService} from '@libs/procurement/shared';


export const ControllingGeneralContractorAddExpensesEntityInfo: EntityInfo = EntityInfo.create<IGccAddExpenseEntity> ({
    grid: {
        title: {text: 'Additional Expenses', key: 'controlling.generalcontractor.AdditionalExpenses'},
        containerUuid:'e49ea538c4d942a6be3721f710392ba1',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorAddExpensesBehavior),
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorAddExpensesDataService),
    dtoSchemeId: {moduleSubModule: 'Controlling.GeneralContractor', typeName: 'GccAddExpenseDto'},
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['MdcControllingUnitFk', 'Amount', 'Code', 'Comment', 'ConHeaderFk', 'Description', 'PrcPackageFk']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code :{key:'Code',text:'Code'},
                Amount :{key:'Amount',text:'Amount'},
                MdcControllingUnitFk :{key:'entityControllingUnit',text:'Controlling Unit'},
                ConHeaderFk :{key:'ConHeaderFk',text:'Contract'},
                PrcPackageFk :{key:'prcPackageFk',text:'Package'},
                Description :{key:'Description',text:'Description'},
                Comment :{key:'Comment',text:'Comment'}
            })
        },
        overloads: {
            Code :{ readonly:true},
            Amount :{ readonly:true},
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
            PrcPackageFk :{
                readonly:true,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementPackageLookupService,
                    showDescription: true,
                    descriptionMember: 'Description'
                })
            },
            Description :{readonly:true},
            Comment :{readonly:true}
        }
    }
});