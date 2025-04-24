import {inject, Injectable, Injector} from '@angular/core';

import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {IControllingCommonActualEntity} from '../model/entities/controlling-common-actual-entity.interface';
import {merge} from 'lodash';
import {
    BasicsShareControllingUnitLookupService,
    BasicsSharedBasAccountLookupService,
    BasicsSharedCurrencyLookupService
} from '@libs/basics/shared';

@Injectable({
    providedIn: 'root'
})
export class ControllingCommonActualExtendLayoutService {
    private readonly injector = inject(Injector);
    public async generateLayout<T extends  object & IControllingCommonActualEntity>(customizeConfig?: object):Promise<ILayoutConfiguration<T>>{
        const commonLayout = {
            groups: [
                {
                    gid: 'basegroup',
                    attributes: [
                        'Account',
                        'AccountDescription',
                        'Amount',
                        'Code',
                        'CommentText',
                        'CompanyFk',
                        'CompanyPeriod',
                        'CompanyYear',
                        'MdcControllingUnit',
                        'MdcControllingUnitDescription',
                        'MdcControllingUnitFk',
                        'Quantity',
                        'Uom',
                        'NominalDimension1',
                        'NominalDimension2',
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('controlling.common.', {
                    Code: {key: 'entityCode'},
                    CommentText: {key: 'entityCommentText'},
                    HasContCostCode: {key: 'entityHasControllingCostCode'},
                    ValueTypeFk: {key: 'entityValueTypeFk'},
                    AccountFk: {key: 'entityAccountFk'},
                    Amount: {key: 'entityAmount'},
                    CurrencyFk: {key: 'entityCurrencyFk'},
                    MdcControllingUnitFk: {key: 'entityControllingUnitFk'},
                    Quantity: {key: 'entityQuantity'},
                    Uom: {key: 'entityUomFk'},
                    NominalDimension1: {key: 'entityProjectFk'},
                    NominalDimension2: {key: 'entityHasAccount'},

                }),
            },
            overloads: {
                Code: {readonly: true},
                CommentText: {readonly: true},
                HasContCostCode: {readonly: true},
                Amount: {readonly: true},
                Quantity: {readonly: true},
                BudgetShift: {readonly: true},
                Uom: {readonly: true},
                NominalDimension1: {readonly: true},
                NominalDimension2: {readonly: true},
                ValueTypeFk: {
                    // TODO - depends on basics.customize.valuetype
                },
                AccountFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedBasAccountLookupService
                    })
                },
                CurrencyFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedCurrencyLookupService,
                        showDescription: true,
                        descriptionMember: 'Currency'
                    })
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
        };
        if(!customizeConfig){
            return commonLayout as ILayoutConfiguration<T>;
        }
        const customizeLayout = customizeConfig as ILayoutConfiguration<T> ;
        let standardAttrs: string[] = [];
        if (commonLayout.groups && commonLayout.groups.length > 0 ){
            standardAttrs = commonLayout.groups[0].attributes.slice();
        }
        const mergedObject = merge(commonLayout, customizeLayout) ;
        if (mergedObject.groups && mergedObject.groups.length > 0 && customizeLayout.groups && customizeLayout.groups.length > 0)  {
            const uniqueAttributes = [...new Set([...mergedObject.groups[0].attributes, ...standardAttrs])];
            mergedObject.groups[0].attributes = uniqueAttributes;
        }
        return  mergedObject;
    }
}