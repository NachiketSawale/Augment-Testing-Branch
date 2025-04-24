/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { BasicsConfigWizardGroupDataService } from '../services/basics-config-wizard-group-data.service';

import { BasicsConfigWizardGroupIconService } from '../services/basics-config-wizard-group-icon.service';

import { IWizardGroupEntity } from './entities/wizard-group-entity.interface';

export const BASICS_CONFIG_WIZARD_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IWizardGroupEntity>({

    grid: {
        title: { key: 'basics.config.wizardGroupContainerTitle' },
    },
    form: {
        title: { key: 'basics.config.wizardGroupDetailsContainerTitle' },
        containerUuid: '732b607708e041448a37ee71670cf559',
    },

    dataService: ctx => ctx.injector.get(BasicsConfigWizardGroupDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'WizardGroupDto' },
    permissionUuid: '3f448dee55f8455e99292d5ecf1f0721',
    layoutConfiguration: async ctx => {
        const basicsConfigWizardGroupIconService = ctx.injector.get(BasicsConfigWizardGroupIconService);

        return <ILayoutConfiguration<IWizardGroupEntity>>{
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
                        'IsDefault',
                        'Icon',
                        'IsVisible',
                        'AccessRightDescriptorFk'
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
                    IsDefault: {
                        key: 'entityDefault',
                    },
                    Icon: {
                        key: 'entityIcon',
                    },
                    IsVisible: {
                        key: 'entityIsVisible',
                    },
                    AccessRightDescriptorFk: {
                        key: 'descriptor',
                    }

                }),
            },
            overloads: {
                Icon: {
                    grid: {
                        //TODO: impelemtation will modify
                        // once image select is done.
                        type: FieldType.ImageSelect,
                        itemsSource: {
                            items: basicsConfigWizardGroupIconService.createWizardGroupCssIconObjects()
                        }
                    }
                },
                AccessRightDescriptorFk: {
                    readonly: true
                }

            }
        };


    }
});