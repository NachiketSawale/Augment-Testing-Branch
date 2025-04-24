/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import {
    EstimateMainStandardAllowancesCostCodeDetailBehavior
} from './estimate-main-standard-allowances-cost-code-detail-behavior.service';
import { EstimateMainStandardAllowancesCostCodeDetailDataService } from './estimate-main-standard-allowances-cost-code-detail-data.service';
import {
    EstimateMainStandardAllowancesCostCodeDetailLayoutService
} from './estimate-main-standard-allowances-cost-code-detail-layout.service';
import { IEstAllMarkup2costcodeEntity } from '@libs/estimate/interfaces';


 export const ESTIMATE_MAIN_STANDARD_ALLOWANCES_COST_CODE_DETAIL_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstAllMarkup2costcodeEntity> ({
                grid: {
                    title: {key: 'estimate.main' + '.standardAllowancesCostCodesDetails'},
                    containerUuid: 'e4a0ca6ff2214378afdc543646e6b079',
                    treeConfiguration:true,
                    behavior: (ctx) => ctx.injector.get(EstimateMainStandardAllowancesCostCodeDetailBehavior),
                },
                dataService: ctx => ctx.injector.get(EstimateMainStandardAllowancesCostCodeDetailDataService),
                dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstAllMarkup2costcodeDto'},
                permissionUuid: '3416213311ef4b078db786669a80735e',
                layoutConfiguration: context => {
                    return context.injector.get(EstimateMainStandardAllowancesCostCodeDetailLayoutService).generateConfig();
                }
            });