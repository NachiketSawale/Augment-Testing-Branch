/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingActualsCostDataDataService } from '../services/controlling-actuals-cost-data-data.service';
import {ICompanyCostDataEntity} from './entities/company-cost-data-entity.interface';
import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {
    BasicsShareControllingUnitLookupService,
    BasicsSharedCostCodeLookupService,
    BasicsSharedCurrencyLookupService,
    BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import {inject} from '@angular/core';


 export const CONTROLLING_ACTUALS_COST_DATA_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyCostDataEntity> ({
                grid: {
                    title: {key: 'controlling.actuals' + '.costDataListTitle'},
                },
                form: {
			    title: { key: 'controlling.actuals' + '.costDataDetailTitle' },
			    containerUuid: '8c235d8d773a4828995911974a6b4a87',
		        },
                dataService: ctx => ctx.injector.get(ControllingActualsCostDataDataService),
                dtoSchemeId: {moduleSubModule: 'Controlling.Actuals', typeName: 'CompanyCostDataDto'},
                permissionUuid: '519f57ab55da420694b4d52264db09b4',
                layoutConfiguration: {
                     groups: [{
                         gid: 'default',
                         attributes: [
                             'AccountFk',
                             'Amount',
                             'AmountOc',
                             'AmountProject',
                             'CommentText',
                             'CurrencyFk',
                             'MdcContrCostCodeFk',
                             'MdcControllingUnitFk',
                             'MdcCostCodeFk',
                             'Quantity',
                             'UomFk',
                             'NominalDimension1',
                             'NominalDimension2',
                             'NominalDimension3'
                         ]
                     }],
                    overloads:{
                        AmountOc:{readonly:true},
                        AmountProject:{readonly:true},
                        CurrencyFk:{
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: BasicsSharedCurrencyLookupService,
                                showDescription: true,
                                descriptionMember: 'Currency'
                            })
                        },
                        UomFk:BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
                        MdcCostCodeFk: {
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: BasicsSharedCostCodeLookupService,
                                showClearButton: true
                            })
                        },
                        MdcControllingUnitFk: {
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
                        AccountFk:{
                            /*
                            *
                            *Here rely on basicsCustomAccountLookupDataService, support after the call
                            *
                            * */
                        },
                        MdcContrCostCodeFk:{
                            /*
                           *
                           *Here rely on basics-cost-codes-controlling-lookup, support after the call
                           *
                           * */
                        }
                    },
                     labels: {
                         ...prefixAllTranslationKeys('controlling.actuals.', {
                             AccountFk: {key: 'entityAccountFk'},
                             Amount: {key: 'entityAmount'},
                             AmountOc:{key: 'entityAmountOc'},
                             AmountProject:{key: 'entityAmountProject'},
                             CommentText:{key: 'entityCommentText'},
                             MdcContrCostCodeFk: {key: 'entityControllingCodeFk'},
                             CurrencyFk: {key: 'entityCurrencyFk'},
                             MdcControllingUnitFk: {key: 'entityControllingUnitFk'},
                             MdcCostCodeFk: {key: 'entityCostCodeFk'},
                             Quantity: {key: 'entityQuantity'},
                             UomFk: {key: 'entityUomFk'},
                             NominalDimension1: {key: 'entityProjectFk'},
                             NominalDimension2: {key: 'entityHasAccount'},
                             NominalDimension3: {key: 'entityTotal'},

                         })
                     }
                 }
            });