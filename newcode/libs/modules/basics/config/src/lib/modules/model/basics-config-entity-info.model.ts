/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsConfigDataService } from '../services/basics-config-data.service';
import { IModuleEntity } from './entities/module-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const BASICS_CONFIG_ENTITY_INFO: EntityInfo = EntityInfo.create<IModuleEntity> ({
                grid: {
                    title: {key: 'basics.config.moduleContainerTitle'},
                },
                dataService: ctx => ctx.injector.get(BasicsConfigDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Config', typeName: 'ModuleDto'},
                permissionUuid: 'f2c8a4e8330946069c54ee75a4f40db1',
                layoutConfiguration:  {
                    groups: [
                        {
                            gid: 'basicData',
                            title: {
                                key: 'cloud.common.entityProperties',
                                text: 'Basic Data'
                            },
                            attributes: [
                                'DescriptionInfo',
                                'InternalName',
                                'Sorting',
                                'SortOrderPath',
                                'LogFileTableName',
                                'IsHome',
                                'MaxPageSize'
                            ]
                        }
                    ],
                    overloads: {
                        InternalName: {
                            readonly:true
                        },
                        SortOrderPath: {
                            readonly:true
                        },
                        IsHome: {
                            readonly:true
                        },
                        DescriptionInfo: {
                            readonly:true
                        }
                        
                    },
                    labels: {
                        ...prefixAllTranslationKeys('basics.config.', {
                            
                            'InternalName': {
                                'key': 'entityInternalName',
                            },
                            'Sorting': {
                                'key': 'tabSorting',
                            },
                            'SortOrderPath': {
                                'key': 'moduleSortOrderPath',
                            },
                            'LogFileTableName': {
                                'key': 'moduleLogFileTableName',
                            },
                            'IsHome': {
                                'key': 'isHome',
                            },
                            'MaxPageSize': {
                                'key': 'entityMaxPageSize',
                            }
        
                        }),
                    },
                }
                

            });