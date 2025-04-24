/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMdcContrFormulaPropDefEntity } from './entities/mdc-contr-formula-prop-def-entity.interface';
import {
    ControllingConfigurationFormulaDefinitionBehavior
} from '../behaviors/controlling-configuration-formula-definition-behavior.service';
import {
    ControllingConfigurationFormulaDefinitionDataService
} from '../services/controlling-configuration-formula-definition-data.service';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsSharedControllingColumnTypeLookupService} from '@libs/basics/shared';
import {FormulaSvgImageComponent} from '../components/formula-svg-image/formula-svg-image.component';


export const CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_ENTITY_INFO: EntityInfo = EntityInfo.create<IMdcContrFormulaPropDefEntity> ({
    grid: {
        title: {key: 'controlling.configuration.ConfFormulaDefinitionTitle'},
        behavior: context => context.injector.get(ControllingConfigurationFormulaDefinitionBehavior)
    },
    form: {
        title: { text: 'formula Details' },
        containerUuid: '22eb0d23d560466a8521c81745f40406',
    },
    dataService: ctx => ctx.injector.get(ControllingConfigurationFormulaDefinitionDataService),
    // todo: after validation can work fine, show cancel this cancel operation
    // validationService: ctx => ctx.injector.get(ControllingConfigurationFormulaDefinitionValidateService),
    dtoSchemeId: {moduleSubModule: 'Controlling.Configuration', typeName: 'MdcContrFormulaPropDefDto'},
    permissionUuid: '22eb0d23d560466a8521c81745f40405',
    description: {
        text: 'Formula Definition',
        key: 'controlling.configuration.ConfFormulaDefinitionTitle',
    },
    layoutConfiguration:{
        groups: [
            {
                gid: 'default',
                attributes:[
                    'Code',
                    'BasContrColumnTypeFk',
                    'DescriptionInfo',
                    'Formula',
                    'IsDefault',
                    'IsEditable',
                    'IsVisible'
                ]
            }
        ],
        overloads:{
            Formula:{
              type: FieldType.CustomComponent,
                componentType:FormulaSvgImageComponent
            },
            BasContrColumnTypeFk: {
              type: FieldType.Lookup,
              lookupOptions: createLookup({
                  dataServiceToken: BasicsSharedControllingColumnTypeLookupService,
                  showDescription: true,
                  descriptionMember: 'Description'
              })
            }
        },
        labels:{
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {key: 'entityCode'},
                DescriptionInfo: {key: 'entityDescription'},
            }),
            ...prefixAllTranslationKeys('controlling.configuration.', {
                BasContrColumnTypeFk: {key: 'BasContrColumnTypeFk'},
                Formula: {key: 'Formula'},
                IsDefault: {key: 'IsDefault'},
                IsEditable: {key: 'IsEditable'},
                IsVisible: {key: 'isVisible'}
            })
        }
    }
});