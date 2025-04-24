/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import {
    EstimateMainAllowanceAreaBehavior
} from './estimate-main-allowance-area-behavior.service';
import { EstimateMainAllowanceAreaDataService } from './estimate-main-allowance-area-data.service';
import {IEstAllowanceAreaEntity} from '@libs/estimate/interfaces';
import {EstimateMainAllowanceAreaLayoutService} from './estimate-main-allowance-area-layout.service';


 export const ESTIMATE_MAIN_ALLOWANCE_AREA_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstAllowanceAreaEntity> ({
                grid: {
                    title: {key: 'estimate.main' + '.allowanceArea'},
                    behavior: ctx => ctx.injector.get(EstimateMainAllowanceAreaBehavior),
                    treeConfiguration: true
                },
                dataService: ctx => ctx.injector.get(EstimateMainAllowanceAreaDataService),
                dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstAllowanceAreaDto'},
                permissionUuid: '4265ca844fcb457e83e0fd8fadda115f',
                layoutConfiguration: context => {
                    return context.injector.get(EstimateMainAllowanceAreaLayoutService).generateConfig();
                }
 });