/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';

import { BasicsConfigGenericWizardContainerDataService } from '../services/basics-config-generic-wizard-container-data.service';

import { IGenericWizardContainerEntity } from './entities/generic-wizard-container-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Basics Config Generic Wizard Container info model  
 */
 export const BASICS_CONFIG_GENERIC_WIZARD_CONTAINER_ENTITY_INFO: EntityInfo = EntityInfo.create<IGenericWizardContainerEntity> ({
                grid: {
                    title: {key: 'basics.config.genWizardContainerListContainerTitle'}
                },
                form: {
			    title: { key: 'basics.config.genWizardContainerDetailContainerTitle' },
			    containerUuid: 'eba7b7e61ea74cc9916e43bb60b11405',
		        },
                dataService: ctx => ctx.injector.get(BasicsConfigGenericWizardContainerDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Config', typeName: 'GenericWizardContainerDto'},
                permissionUuid: '80f2ec7bf665413f916a0aee614b9439',
                layoutConfiguration:  {
                    groups: [
                        {
                            gid: 'basicData',
                            title: {
                                key: 'cloud.common.entityProperties',
                                text: 'Basic Data',
                            },
                            attributes: ['ContainerUuid', 'CanInsert', 'FilearchivedocFk', 'CommentInfo', 'Sorting', 'Remark', 'TitleInfo'],
                        },
                    ],
                    labels: {
                        ...prefixAllTranslationKeys('basics.config.', {
                            ContainerUuid: {
                                key: 'containerUuid',
                            },
                            CanInsert: {
                                key: 'canInsert',
                            },
                            FilearchivedocFk: {
                                key: 'filearchivedocFk'
                            },
                            Sorting: {
                                key: 'sorting'
                            },
                            TitleInfo: {
                                key: 'entityTitle'
                            }
        
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
                        ContainerUuid: {
                            readonly: true
                        },
                        CanInsert: {
                            readonly: true
                        },
                        FilearchivedocFk: {
                            readonly: true,
                            //Todo : need to add lookup, currently API call not found for that
                        },
                    },
                },   
            });