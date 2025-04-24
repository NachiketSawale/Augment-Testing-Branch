/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {ControllingActualsCostHeaderDataService} from '../services/controlling-actuals-cost-header-data.service';
import {ICompanyCostHeaderEntity} from './entities/company-cost-header-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {ControllingActualsCostHeaderBehavior} from '../behaviors/controlling-actuals-cost-header-behavior.service';
import {BasicsSharedCustomizeLookupOverloadProvider} from '@libs/basics/shared';
import {ControllingCommonCompanyYearLookupService, CompanyPeriodLookupServiceFactory} from '@libs/controlling/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
export const CONTROLLING_ACTUALS_COST_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyCostHeaderEntity> ({
                grid: {
                    title: {key: 'controlling.actuals' + '.costHeaderListTitle'},
                },
                form: {
			    title: { key: 'controlling.actuals' + '.costHeaderDetailTitle' },
			    containerUuid: 'bd82c66d78c84a3ca67c3baf4135fd98',
		        },
                dataService: ctx => ctx.injector.get(ControllingActualsCostHeaderDataService),
                dtoSchemeId: {moduleSubModule: 'Controlling.Actuals', typeName: 'CompanyCostHeaderDto'},
                permissionUuid: 'bb7a4b489f674664a5f853259d5382ff',
                layoutConfiguration: ctx => {
                    return {
                     groups: [{
                         gid: 'default',
                         attributes: ['Code','CommentText','CompanyYearFk','CompanyYearFkStartDate','CompanyYearFkEndDate','CompanyPeriodFk','CompanyPeriodFkStartDate','CompanyPeriodFkEndDate','ValueTypeFk','ProjectFk','HasCostCode','HasContCostCode','HasAccount','Total','TotalOc','IsFinal']
                     }],
                    overloads:{
                        CompanyYearFkStartDate:{readonly:true},
                        CompanyYearFkEndDate:{readonly:true},
                        CompanyPeriodFkStartDate:{readonly:true},
                        CompanyPeriodFkEndDate:{readonly:true},
                        Total:{type: FieldType.Money,readonly:true},
                        TotalOc:{type: FieldType.Money,readonly:true},
                        IsFinal:{readonly:true},
                        ValueTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideValueTypeLookupOverload(false),
                        CompanyYearFk:{
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: ControllingCommonCompanyYearLookupService,
                                showDescription: true,
                                descriptionMember: 'Id',
                                readonly:false
                            })
                        },
                        CompanyPeriodFk:{
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataService: ctx.injector.get(CompanyPeriodLookupServiceFactory).createLookup({
                                    dataServiceToken : ControllingActualsCostHeaderDataService}),
                                showDescription: true,
                                descriptionMember: 'Id',
                                readonly:false
                            })
                        },
                        ProjectFk:{
                            type: FieldType.Lookup,
                            visible: true,
                            lookupOptions:  createLookup({
                                dataServiceToken: ProjectSharedLookupService,
                                showDescription: true,
                                descriptionMember: 'ProjectNo',
                            })
                        },
                    },
                     labels: {
                         ...prefixAllTranslationKeys('controlling.actuals.', {
                             Code: {key: 'entityCode'},
                             CommentText: {key: 'entityCommentText'},
                             CompanyYearFk:{key: 'entityCompanyYearServiceFk'},
                             CompanyYearFkStartDate:{key: 'entityCompanyYearServiceFkStartDate'},
                             CompanyYearFkEndDate:{key: 'entityCompanyYearServiceFkEndDate'},
                             HasCostCode: {key: 'entityHasCostCode'},
                             CompanyPeriodFk: {key: 'entityTradingPeriodFk'},
                             CompanyPeriodFkStartDate: {key: 'entityCompanyTradingPeriodFkStartDate'},
                             CompanyPeriodFkEndDate: {key: 'entityCompanyTradingPeriodFkEndDate'},
                             HasContCostCode: {key: 'entityHasControllingCostCode'},
                             ValueTypeFk: {key: 'entityValueTypeFk'},
                             ProjectFk: {key: 'entityProjectFk'},
                             HasAccount: {key: 'entityHasAccount'},
                             Total: {key: 'entityTotal'},
                             TotalOc: {key: 'entityTotalOc'},
                             IsFinal: {key: 'isFinal'},
                         })
                     }
                 };
                    },
                 containerBehavior:ctx => ctx.injector.get(ControllingActualsCostHeaderBehavior)
            });