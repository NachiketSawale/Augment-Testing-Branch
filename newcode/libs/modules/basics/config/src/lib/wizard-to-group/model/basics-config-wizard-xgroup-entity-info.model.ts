/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, createLookup } from '@libs/ui/common';
import { BasicsConfigWizardXGroupLookupService } from '../services/basics-config-wizard-xgroup-lookup.service';
import { BasicsConfigWizardXGroupDataService } from '../services/basics-config-wizard-xgroup-data.service';
import { IWizard2GroupEntity } from '../model/entities/wizard-2group-entity.interface';

/**
 * Basics config wizard to group info model file
 */
export const BASICS_CONFIG_WIZARD_XGROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IWizard2GroupEntity>({
    grid: {
        title: { key: 'basics.config.wizardXGroupContainerTitle' },
    },
    form: {
        title: { key: 'basics.config.wizardXGroupDetailsContainerTitle' },
        containerUuid: '9d89b7ed20fc4a038ee3b5e1205c589a'
    },

    dataService: ctx => ctx.injector.get(BasicsConfigWizardXGroupDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'Wizard2GroupDto' },
    permissionUuid: '93237273a35e4aa18ba61c2d182e4661',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data'
                },
                attributes: [
                    'Name',
                    'DescriptionInfo',
                    'Sorting',
                    'AccessRightDescriptorFk',
                    'WizardFk',
                    'IsVisible',
                    'Visibility'
                ]
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.config.', {
                Name: {
                    key: 'entityName',
                },
                DescriptionInfo: {
                    key: 'entityDescription',
                },
                Sorting: {
                    key: 'tabSorting',
                },
                AccessRightDescriptorFk: {
                    key: 'descriptor',
                },
                WizardFk: {
                    key: 'wizardFk',
                },
                IsVisible: {
                    key: 'entityIsVisible',
                },
                Visibility: {
                    key: 'dashboardvisibility',
                },

            }),
        },
        overloads: {
            AccessRightDescriptorFk: {
                readonly: true,
            },
            WizardFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsConfigWizardXGroupLookupService,
                })

            },
            Visibility: {
                grid: {
                    type: FieldType.Select,
                    itemsSource: {
                        items: [
                            {
                                id: 1,
                                displayName: {
                                    text: '',
                                    key: 'basics.config.visibilityProperty.standardOnly',
                                },
                            },
                            {
                                id: 2,
                                displayName: {
                                    text: '',
                                    key: 'basics.config.visibilityProperty.portalOnly',
                                },
                            },
                            {
                                id: 3,
                                displayName: {
                                    text: '',
                                    key: 'basics.config.visibilityProperty.standardPortal',
                                },
                            },
                        ],
                    },
                    sortable: true,
                },
            },

        }
    }
});