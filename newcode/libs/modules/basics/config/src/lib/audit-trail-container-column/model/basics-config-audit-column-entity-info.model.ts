/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';

import { BasicsConfigAuditColumnDataService } from '../services/basics-config-audit-column-data.service';

import { IAudColumnEntity } from './entities/aud-column-entity.interface';

import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Basics config audit trail column entity info model.
 */
 export const BASICS_CONFIG_AUDIT_COLUMN_ENTITY_INFO: EntityInfo = EntityInfo.create<IAudColumnEntity> ({
                grid: {
                    title: {key: 'basics.config' + '.AuditTrailColumnTitle'},
                    containerUuid:'70ce60e7961149d5ba537fb1eae45c7a'
                },
                form: {
                    title: {key: 'basics.config' + '.AuditTrailColumnDetailsTitle'},
                    containerUuid:'559c4bdc950c4b4f8e23af84fde9378e'
                },
                
                dataService: ctx => ctx.injector.get(BasicsConfigAuditColumnDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Config', typeName: 'AudColumnDto'},
                permissionUuid: 'a3416418eed24b3fa1fc439172c61320',
                layoutConfiguration: {
                    groups: [
                        {
                            gid: 'basicData',
                            title: {
                                key: 'basics.config.AuditTrailColumnTitle',
                                text: 'Basic Data',
                            },
                            attributes: ['Id', 'Columnname', 'Isenabletracking'],
                        },
                    ],
                    labels: {
                        ...prefixAllTranslationKeys('basics.config.moduleViews.', {
                            Id: {
                                key: 'columnViewId',
                            },
                        }),
                        ...prefixAllTranslationKeys('basics.config.', {
                            Columnname: {
                                key: 'entityColumnname',
                            },
                        }),
                        ...prefixAllTranslationKeys('basics.config.', {
                            Isenabletracking: {
                                key: 'entityIsenabletracking',
                            },
                        }),
                    },
                    overloads: {
                        Id: {
                            readonly: true,
                        },
                        Columnname: {
                            readonly: true
                        }
                    },
                },
            });