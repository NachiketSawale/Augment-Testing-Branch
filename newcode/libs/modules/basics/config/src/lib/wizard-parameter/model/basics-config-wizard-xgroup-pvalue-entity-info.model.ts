/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { FieldType, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { BasicsConfigWizardXGroupPValueDataService } from '../services/basics-config-wizard-xgroup-pvalue-data.service';
import { BasicsConfigWizardXGroupPValueBehavior } from '../behaviors/basics-config-wizard-xgroup-pvalue-behavior.service';
import { BasicsConfigReportLookupService } from '../services/lookup/basics-config-report-lookup.service';
import { BasicsConfigWizardParameterLookupService } from '../services/lookup/basics-config-wizard-parameter-lookup.service';

import { IWizard2GroupPValueEntity } from './entities/wizard-2group-pvalue-entity.interface';

export const BASICS_CONFIG_WIZARD_XGROUP_PVALUE_ENTITY_INFO: EntityInfo = EntityInfo.create<IWizard2GroupPValueEntity>({
    grid: {
        title: { key: 'basics.config.wizardXGroupPValuesContainerTitle' },
        behavior: ctx => ctx.injector.get(BasicsConfigWizardXGroupPValueBehavior),
    },
    form: {
        title: { key: 'basics.config.wizardXGroupPValuesDetailsContainerTitle' },
        containerUuid: '1b74b025011c4bc3b6a9be3478d2d3a1'
    },

    dataService: ctx => ctx.injector.get(BasicsConfigWizardXGroupPValueDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'Wizard2GroupPValueDto' },
    permissionUuid: '1ffb1f2589264df18745ba1f89cace0a',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data'
                },
                attributes: [
                    'Value',
                    'Sorting',
                    'WizardParameterFk',
                    'Domain',

                ]
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.config.', {
                Value: {
                    key: 'entityValue',
                },
                Sorting: {
                    key: 'tabSorting',
                },
                WizardParameterFk: {
                    key: 'entityWizardParameterFk',
                },
                Domain: {
                    key: 'entityDomain',
                },
                ReportFk: {
                    key: 'reportfk'
                }
            }),
        },
        overloads: {
            WizardParameterFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsConfigWizardParameterLookupService,
                    readonly: true
                })
            },
            ReportFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsConfigReportLookupService
                })
            },
            Domain: {
                readonly: true
            }
        }
    }

});