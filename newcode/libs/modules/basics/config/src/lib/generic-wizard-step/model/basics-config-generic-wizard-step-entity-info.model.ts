/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { IGenericWizardStepEntity } from './entities/generic-wizard-step-entity.interface';

import { BasicsConfigGenericWizardStepDataService } from '../services/basics-config-generic-wizard-step-data.service';
import { BasicsCustomGenWizardStepTypeLookupDataService } from '../services/lookup/basics-custom-gen-wizard-step-type-lookup-data.service';

import { FieldType, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const BASICS_CONFIG_GENERIC_WIZARD_STEP_ENTITY_INFO: EntityInfo = EntityInfo.create<IGenericWizardStepEntity>({
    grid: {
        title: { key: 'basics.config.genWizardStepListContainerTitle' },
    },
    form: {
        title: { key: 'basics.config' + '.genWizardStepDetailContainerTitle' },
        containerUuid: 'EAD02071C4C943C19DA857B574493BB8',
    },
    dataService: ctx => ctx.injector.get(BasicsConfigGenericWizardStepDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'GenericWizardStepDto' },
    permissionUuid: '4A4450D578644C8D88E8A669133D77C8',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: ['TextHeader', 'TextFooter', 'GenericWizardStepTypeFk', 'GenericWizardStepFk',
                    'Sorting', 'AutoSave', 'Remark', 'CommentInfo', 'IsHidden', 'TitleInfo'],
            },
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.config.', {
                TextHeader: {
                    key: 'textHeader',
                },
                TextFooter: {
                    key: 'textFooter',
                },
                GenericWizardStepFk: {
                    key: 'genericWizardStep'
                },
                Sorting: {
                    key: 'tabSorting'
                },
                AutoSave: {
                    key: 'autoSave'
                },
                IsHidden: {
                    key: 'isHidden'
                },
                TitleInfo: {
                    key: 'entityTitle'
                }

            }),
            ...prefixAllTranslationKeys('basics.customize.', {
                GenericWizardStepTypeFk: {
                    key: 'genericwizardsteptype',
                },

            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                Remark: {
                    key: 'entityRemark'
                },
                CommentInfo: {
                    key: 'entityComment'
                }

            }),
        },
        overloads: {
            GenericWizardStepTypeFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCustomGenWizardStepTypeLookupDataService,
                })
            },
            GenericWizardStepFk: {
                readonly: true
            },
            AutoSave: {
                readonly: true
            }
        },
    },
});