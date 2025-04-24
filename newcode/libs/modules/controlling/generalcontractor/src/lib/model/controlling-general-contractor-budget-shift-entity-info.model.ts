import {EntityInfo} from '@libs/ui/business-base';
import {IGccBudgetShiftEntity} from './entities/gcc-budget-shift-entity.interface';
import {
    ControllingGeneralContractorBudgetShiftDataService
} from '../services/controlling-general-contractor-budget-shift-data.service';

import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsShareControllingUnitLookupService} from '@libs/basics/shared';
import {inject} from '@angular/core';
import {
    ControllingGeneralContractorBudgetShiftBehavior
} from '../behaviors/controlling-general-contractor-budget-shift-behavior.service';

export const ControllingGeneralContractorBudgetShiftEntityInfo: EntityInfo = EntityInfo.create<IGccBudgetShiftEntity> ({
    grid: {
        title: {text: 'Budget Shift', key: 'controlling.generalcontractor.Mutation'},
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorBudgetShiftBehavior),
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorBudgetShiftDataService),
    dtoSchemeId: {moduleSubModule: 'Controlling.GeneralContractor', typeName: 'GccBudgetShiftDto'},
    permissionUuid: '054e0701989342c7ae3cd72ca1cc83ad',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['Code', 'Description', 'Value', 'Comment', 'MdcCounitSourceFk', 'MdcCounitTargetFk']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code :{key:'Code',text:'Code'},
                Value :{key:'Amount',text:'Amount'},
                MdcCounitSourceFk :{key:'SourceCounit',text:'Source Controlling Unit'},
                MdcCounitTargetFk :{key:'TargetCounit',text:'Target Controlling Unit'},
                Description :{key:'Description',text:'Description'},
                Comment :{key:'Comment',text:'Comment'}
            })
        },
        overloads: {
            Code :{ readonly:true},
            MdcCounitSourceFk :{
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
            MdcCounitTargetFk :{
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

            Description :{readonly:true},
            Comment :{readonly:true},
            Value:{readonly:true}
        }
    }

});