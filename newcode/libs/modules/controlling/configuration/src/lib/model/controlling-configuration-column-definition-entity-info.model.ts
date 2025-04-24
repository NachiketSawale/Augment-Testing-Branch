/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingConfigurationColumnDefinitionDataService } from '../services/controlling-configuration-column-definition-data.service';
import { ControllingConfigurationColumnDefinitionBehavior } from '../behaviors/controlling-configuration-column-definition-behavior.service';
import { IMdcContrColumnPropDefEntity } from './entities/mdc-contr-column-prop-def-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_ENTITY_INFO: EntityInfo = EntityInfo.create<IMdcContrColumnPropDefEntity> ({
    grid: {
        title: {key: 'controlling.configuration.ConfColumnDefinitionTitle'},
        behavior: context => context.injector.get(ControllingConfigurationColumnDefinitionBehavior)
    },

    dataService: ctx => ctx.injector.get(ControllingConfigurationColumnDefinitionDataService),
    dtoSchemeId: {moduleSubModule: 'Controlling.Configuration', typeName: 'MdcContrColumnPropDefDto'},
    permissionUuid: '7417c99b19084beba2d45605f91cad6f',
    description: {
        text: 'Column Definition',
        key: 'controlling.configuration.ConfColumnDefinitionTitle',
    },
    layoutConfiguration:{
        groups: [
            {
                gid: 'default',
                attributes:[
                    'Code',
                    'Description'
                ]
            }
        ],
        overloads:{
            Code:{ readonly: true},
            Description:{ readonly: true}
        },
        labels:{
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {key: 'entityCode'},
                Description: {key: 'entityDescription'},
            })
        }
    }
});