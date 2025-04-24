/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsProcurementConfiguration2StrategyDataService } from '../../services/basics-procurement-configuration-2strategy-data.service';
import { IPrcConfiguration2StrategyEntity } from '../entities/prc-configuration-2-strategy-entity.interface';


export const BASICS_PROCUREMENT_CONFIGURATION_2STRATEGY_ENTITY_INFO = EntityInfo.create<IPrcConfiguration2StrategyEntity>({
    grid: {
        title: {text: 'Strategys', key: 'basics.procurementconfiguration.strategyGridTitle'}

    },
    form: {
        containerUuid: '9d4c9e3ed27d484e91be6384d932f226',
        title: {text: 'Strategy Detail', key: 'basics.procurementconfiguration.strategyDetailTitle'}
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfiguration2StrategyDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfiguration2StrategyDto'},
    permissionUuid: 'bd5e5bcfda44437884c0905a8384e9f3',
    layoutConfiguration:
        {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        key: 'cloud.common.entityProperties',
                        text: 'Basic Data'
                    },
                    attributes: [
                        'PrcStrategyFk',
                        'PrcCommunicationChannelFk'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'PrcStrategyFk': {
                        'key': 'EntityStrategy',
                        'text': 'Strategy'
                    },
                    'PrcCommunicationChannelFk': {
                        'key': 'entityCommunicationChannel',
                        'text': 'Communication Channel'
                    }
                })
            },
            overloads: {
                PrcStrategyFk: BasicsSharedLookupOverloadProvider.providePrcStrategyLookupOverload(),
                PrcCommunicationChannelFk: BasicsSharedCustomizeLookupOverloadProvider.provideCommunicationChannelLookupOverload(true),
            }
        }
});