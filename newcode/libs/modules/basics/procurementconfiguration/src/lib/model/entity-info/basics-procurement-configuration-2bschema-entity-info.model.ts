/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsProcurementConfiguration2BSchemaDataService } from '../../services/basics-procurement-configuration-2bschema-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcConfiguration2BSchemaEntity } from '../entities/prc-configuration-2-bschema-entity.interface';


export const BASICS_PROCUREMENT_CONFIGURATION_2BSCHEMA_ENTITY_INFO = EntityInfo.create<IPrcConfiguration2BSchemaEntity>({
    grid: {
        title: {text: 'Billing Schemas', key: 'basics.procurementconfiguration.billingSchemaGridTitle'}

    },
    form: {
        containerUuid: 'cbb3297c6a9340b686d7989f0fca18ce',
        title: {text: 'Billing Schema Detail', key: 'basics.procurementconfiguration.billingSchemaDetailTitle'}
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfiguration2BSchemaDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfiguration2BSchemaDto'},
    permissionUuid: '89ca77704b914a36b8ffd6dbbd806035',
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
                        'BillingSchemaFk',
                        'IsDefault'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'BillingSchemaFk': {
                        'key': 'entityBillingSchema',
                        'text': 'Billing Schema'
                    }
                }),
                ...prefixAllTranslationKeys('basics.procurementconfiguration.', {
                    'IsDefault': {
                        'key': 'entityIsDefault',
                        'text': 'Is Default'
                    }
                })
            },
            overloads: {
                BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(false),
            }
        }
});