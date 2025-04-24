/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingGeneralContractorCostHeaderDataService } from '../services/controlling-general-contractor-cost-header-data.service';
import { ControllingGeneralContractorCostHeaderBehavior } from '../behaviors/controlling-general-contractor-cost-header-behavior.service';
import { IGccCostControlDataEntity} from './entities/gcc-cost-control-data-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';


 export const ControllingGeneralContractorCostHeaderEntityInfo: EntityInfo = EntityInfo.create<IGccCostControlDataEntity> ({
                grid: {
                    title: {text: 'Cost Control', key: 'controlling.generalcontractor.CostControlTitle'},
                    treeConfiguration:true,
                    behavior: ctx => ctx.injector.get(ControllingGeneralContractorCostHeaderBehavior),
                },
                dataService: ctx => ctx.injector.get(ControllingGeneralContractorCostHeaderDataService),
                dtoSchemeId: {moduleSubModule: 'Controlling.GeneralContractor', typeName: 'GccCostControlGetProcDto'},
                permissionUuid: '363147351c1a426b82e3890cf661493d',
                layoutConfiguration: {
                    groups: [{
                        gid: 'baseGroup',
                        attributes: ['Code', 'DescriptionInfo', 'Revenue', 'BasicCost', 'BasicCostCO', 'DirectCosts', 'BudgetShift', 'Budget', 'Additional', 'Contract',
                            'Performance','Invoice', 'InvoiceStatus', 'ActualsWithoutContract', 'ActualCosts', 'Forecast', 'Result','UserDefined1','UserDefined2','UserDefined3','BudgetPackage',
                            'GccCostControlComment','InvoiceStatusPercent']
                    }],
                    labels: {
                        ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                            Code :{key:'Code',text:'Code'},
                            Revenue :{key:'Revenue',text:'Revenue'},
                            BasicCost :{key:'BasicCost',text:'Basic Cost'},
                            BasicCostCO :{key:'BasicCostCO',text:'Basic Cost CO'},
                            DirectCosts :{key:'DirectCosts',text:'Dir. Costs'},
                            BudgetShift :{key:'BudgetShift',text:'Budget Shift'},
                            Budget :{key:'Budget',text:'Budget'},
                            Additional :{key:'Additional',text:'Additional Expenses'},
                            Contract :{key:'Contract',text:'Contract'},
                            Performance :{key:'Performance',text:'Performance'},
                            Invoice :{key:'Invoice',text:'Invoice'},
                            InvoiceStatus :{key:'InvoiceStatusFk',text:'Invoice Status'},
                            ActualsWithoutContract :{key:'ActualsWithoutContract',text:'Actuals Without Contract'},
                            ActualCosts :{key:'ActualCosts',text:'Actual Costs'},
                            Forecast :{key:'Forecast',text:'Forecast'},
                            Result :{key:'Result',text:'Result'},

                            BudgetPackage :{key:'BudgetPackage',text:'Budget Package'},
                            GccCostControlComment :{key:'Comment',text:'Comment'},
                            InvoiceStatusPercent :{key:'InvoiceStatusPercent',text:'Invoice Status%'}

                        }),
                        ...prefixAllTranslationKeys('cloud.common.', {
                            DescriptionInfo: {key: 'entityDescription', text: '*Description'},
                            UserDefined1 :{key:'entityUserDefined',text:'User Defined 1','params': {'p_0': '1'}},
                            UserDefined2 :{key:'entityUserDefined',text:'User Defined 2','params': {'p_0': '2'}},
                            UserDefined3 :{key:'entityUserDefined',text:'User Defined 3','params': {'p_0': '3'}},
                        })
                    },
                    overloads: {
                        Code :{ readonly:true},
                        Revenue :{ readonly:true},
                        BasicCost :{ readonly:true},
                        BasicCostCO :{ readonly:true},
                        DirectCosts :{ readonly:true},
                        BudgetShift :{readonly:true},
                        Budget :{readonly:true},
                        Additional :{readonly:true},
                        Contract :{readonly:true},
                        Performance :{readonly:true},
                        Invoice :{readonly:true},
                        InvoiceStatus :{readonly:true},
                        ActualsWithoutContract :{readonly:true},
                        ActualCosts :{readonly:true},
                        Forecast :{readonly:true},
                        Result :{readonly:true},

                        BudgetPackage :{readonly:true},
                        GccCostControlComment :{readonly:false},
                        InvoiceStatusPercent :{readonly:true},
                        DescriptionInfo: {readonly:true},
                        UserDefined1 :{readonly:true},
                        UserDefined2 :{readonly:true},
                        UserDefined3 :{readonly:true},

                    }
                }
});