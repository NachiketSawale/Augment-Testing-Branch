import {EntityInfo} from '@libs/ui/business-base';
import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsShareControllingUnitLookupService} from '@libs/basics/shared';
import {inject} from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {
    ControllingGeneralContractorLineItemsDataService
} from '../services/controlling-general-contractor-line-items-data.service';
import {
    ControllingGeneralContractorLineItemsBehaviorService
} from '../behaviors/controlling-general-contractor-line-items-behavior.service';

export const controllingGeneralContractorLineItemsEntityInfo: EntityInfo = EntityInfo.create<IEstLineItemEntity>({
    grid: {
        title: {text: 'Line Items', key: 'controlling.generalcontractor.LineItemsListController'},
        containerUuid: 'b299831694ee4b2b9de7623fb894eb1c',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorLineItemsBehaviorService),
    },

    dtoSchemeId: {
        moduleSubModule: 'Estimate.Main',
        typeName: 'EstLineItemDto'
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorLineItemsDataService),
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['MdcControllingUnitFk', 'Code', 'DescriptionInfo', 'CostTotal', 'Revenue', 'Budget', 'PrjChangeFk', 'BudgetShift', 'AdditionalExpenses']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code: {key: 'Code', text: 'Code'},
                CostTotal: {key: 'Cost', text: 'CostTotal'},
                MdcControllingUnitFk: {key: 'entityControllingUnit', text: 'Controlling Unit'},
                DescriptionInfo: {key: 'Description', text: 'Description'},
                Revenue: {key: 'Revenue', text: 'Revenue'},
                Budget: {key: 'Budget', text: 'Budget'},
                PrjChangeFk: {key: 'PrjChangeFk', text: 'Project Change'},
                BudgetShift: {key: 'BudgetShift', text: 'Budget Shift'},
                AdditionalExpenses: {key: 'AdditionalExpenses', text: 'Additional Expenses'},

            })
        },
        overloads: {
            Code: {readonly: true},
            CostTotal: {readonly: true},
            DescriptionInfo: {readonly: true},
            Revenue: {readonly: true},
            Budget: {readonly: true},
            BudgetShift: {readonly: true},
            AdditionalExpenses: {readonly: true},
            PrjChangeFk: {
                // TODO - depends on project-change-dialog
            },
            MdcControllingUnitFk: {
                readonly: true,
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
        }
    }
});