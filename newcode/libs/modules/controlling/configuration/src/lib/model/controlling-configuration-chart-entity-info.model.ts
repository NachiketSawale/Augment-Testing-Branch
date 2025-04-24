/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { IMdcContrChartEntity } from './entities/mdc-contr-chart-entity.interface';
import { ControllingConfigurationChartBehavior } from '../behaviors/controlling-configuration-chart-behavior.service';
import { ControllingConfigurationChartDataService } from '../services/controlling-configuration-chart-data.service';
import {
    ControllingConfigurationChartValidateService
} from '../services/controlling-configuration-chart-validate.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const CONTROLLING_CONFIGURATION_CHART_ENTITY_INFO: EntityInfo = EntityInfo.create<IMdcContrChartEntity>({
    grid: {
        title: {key: 'controlling.configuration.chartConfigContainerTitle'},
        behavior: context => context.injector.get(ControllingConfigurationChartBehavior)
    },
    form: {
        title: { text: 'Chart Detail' },
        containerUuid: '133fb23194294d81880B101a473b9081',
    },
    dataService: ctx => ctx.injector.get(ControllingConfigurationChartDataService),
    validationService: ctx => ctx.injector.get(ControllingConfigurationChartValidateService),
    dtoSchemeId: {moduleSubModule: 'Controlling.Configuration', typeName: 'MdcContrChartDto'},
    permissionUuid: '133fb23194294d81880B101a473b908f',
    description: {
        text: 'Chart Configuration',
        key: 'controlling.configuration.chartConfigContainerTitle',
    },
    layoutConfiguration:{
        groups: [
            {
                gid: 'default',
                attributes:[
                    'Action',
                    'Description',
                    'IsDefault1',
                    'IsDefault2',
                    'BasChartTypeFk'
                ]
            }
        ],
        labels:{
            ...prefixAllTranslationKeys('cloud.common.', {
                Description: {key: 'entityDescription'},
            }),
            ...prefixAllTranslationKeys('controlling.configuration.', {
                Action: {key: 'action'},
                IsDefault1: {key: 'isDefault1'},
                IsDefault2: {key: 'isDefault2'},
                BasChartTypeFk: {key: 'chartType'}
            })
        }
    }
});