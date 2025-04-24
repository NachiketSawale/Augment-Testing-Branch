/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsProcurementConfigurationRfqDataFormatDataService } from '../../services/basics-procurement-configuration-rfqdataformat-data.service';
import { IPrcConfig2dataformatEntity } from '../entities/prc-config-2-dataformat-entity.interface';


export const BASICS_PROCUREMENT_CONFIGURATION_RFQDATAFORMAT_ENTITY_INFO = EntityInfo.create<IPrcConfig2dataformatEntity>({
    grid: {
        title: {text: 'WizardConfig Data Format', key: 'basics.procurementconfiguration.rfqDataFormat'}
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfigurationRfqDataFormatDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfig2dataformatDto'},
    permissionUuid: 'ed447940563d4102aa19a7b80eb80b15',
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
                        'BasDataformatFk',
                        'IsDefault'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.procurementconfiguration.', {
                    'BasDataformatFk': {
                        'key': 'entityBasDataformat',
                        'text': 'Data format'
                    },
                    'IsDefault': {
                        'key': 'entityIsDefault',
                        'text': 'Is Default'
                    }
                })
            },
            overloads: {
                BasDataformatFk: BasicsSharedCustomizeLookupOverloadProvider.provideDataFormatLookupOverload(false),
            }
        }
});