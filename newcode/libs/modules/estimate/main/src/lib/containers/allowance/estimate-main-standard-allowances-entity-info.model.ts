/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainStandardAllowancesBehavior} from './estimate-main-standard-allowances-behavior.service';
import { EstimateMainStandardAllowancesDataService } from './estimate-main-standard-allowances-data.service';
import {EstimateMainStandardAllowancesLayoutService} from './estimate-main-standard-allowances-layout.service';
import {EstimateMainStandardAllowancesValidationService} from './estimate-main-standard-allowances-validation.service';
import { IEstAllowanceEntity } from '@libs/estimate/interfaces';


 export const ESTIMATE_MAIN_STANDARD_ALLOWANCES_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstAllowanceEntity> ({
                grid: {
                    title: { text: 'Standard Allowances', key: 'estimate.main.StandardAllowancesContainer' },
                    behavior: ctx => ctx.injector.get(EstimateMainStandardAllowancesBehavior)
                },
                dataService: ctx => ctx.injector.get(EstimateMainStandardAllowancesDataService),
                dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstAllowanceDto'},
                permissionUuid: '96e6498b2ffc429dbb1ef2336b45a369',
                validationService: context => context.injector.get(EstimateMainStandardAllowancesValidationService),
                layoutConfiguration: context => {
                    return context.injector.get(EstimateMainStandardAllowancesLayoutService).generateConfig();
                }
            });  