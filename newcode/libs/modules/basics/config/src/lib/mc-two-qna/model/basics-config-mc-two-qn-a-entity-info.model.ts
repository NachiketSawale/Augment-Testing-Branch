/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { BasicsConfigMcTwoQnADataService } from '../services/basics-config-mc-two-qn-a-data.service';

import { IMcTwoQnAEntity } from './entities/mc-two-qn-aentity.interface';

import { prefixAllTranslationKeys } from '@libs/platform/common';

export const BASICS_CONFIG_MC_TWO_QN_A_ENTITY_INFO: EntityInfo = EntityInfo.create<IMcTwoQnAEntity>({
    grid: {
        title: { key: 'basics.config.mcTwoQnAContainerTitle' },
    },
    form: {
        title: { key: 'basics.config.mcTwoQnADetailsContainerTitle' },
        containerUuid:'cb6a787d2c5d48a9b21b06a4f86559f9'
    },

    dataService: ctx => ctx.injector.get(BasicsConfigMcTwoQnADataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'McTwoQnADto' },
    permissionUuid: '27043f3b2c6d482fb1b16365a6abb13a',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data'
                },
                attributes: [
                    'Question',
                    'Answer',
                    'Sorting',
                    'IsLive',
                ]
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.config.', {
                Question: {
                    key: 'entityQuestion',
                },
                Answer: {
                    key: 'entityAnswer',
                },
                Sorting: {
                    key: 'tabSorting',
                },
                IsLive: {
                    key: 'isLive',
                    text: 'Is Live'
                },

            }),
        },
    }
});