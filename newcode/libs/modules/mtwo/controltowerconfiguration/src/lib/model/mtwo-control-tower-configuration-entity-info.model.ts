/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { MtwoControlTowerConfigurationDataService } from '../services/mtwo-control-tower-configuration-data.service';
import { MtwoControlTowerConfigurationBehavior } from '../behaviors/mtwo-control-tower-configuration-behavior.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { IMtwoPowerbiEntity } from '@libs/mtwo/interfaces';

/**
 * MTWO control tower configuration entity info
 */
export const MTWO_CONTROL_TOWER_CONFIGURATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiEntity> ({
    grid: {
        title: {key: 'mtwo.controltowerconfiguration.PowerBIAccount'},
                behavior: ctx => ctx.injector.get(MtwoControlTowerConfigurationBehavior),
    },
    form: {
        title: { key: 'mtwo.controltowerconfiguration.PowerBIDetails' },
        containerUuid: 'ef77063c96ab49aa92c1f6e62641259b',
    },
    dataService: ctx => ctx.injector.get(MtwoControlTowerConfigurationDataService),
    dtoSchemeId: {moduleSubModule: 'Mtwo.ControlTower', typeName: 'MtoPowerbiDto'},
    permissionUuid: 'e06020acd9eb45569d4c8344d9b657bb',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
                attributes: ['Description','Logonname','Password','Clientid'] 
            },
            {
                gid: 'PowerBI Settings', 
                attributes: ['Resourceurl','Authurl','Apiurl','Accesslevel','Authorized','AzureadIntegrated','BasCompanyFk'] 
            }
        ],
        overloads: {
            BasCompanyFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsCompanyLookupService,
                    showDescription: true,
                    descriptionMember: 'CompanyName',
                }),
                additionalFields: [
                    {
                        displayMember: 'CompanyName',
                        label: {
                            text: 'Company Name',
                            key: 'cloud.common.entityCompanyName',
                        },
                        column: false,
                    },
                ],
            },
        },
        labels: {
            ...prefixAllTranslationKeys('mtwo.controltowerconfiguration.', {
                Description: { key: 'Description' },
                Logonname: { key: 'Logonname' },
                Password: { key: 'Password' },
                Clientid: { key: 'Clientid' },
                Resourceurl: { key: 'Resourceurl' },
                Authurl: { key: 'Authurl' },
                Apiurl: { key: 'Apiurl' },  
                Accesslevel: { key: 'Accesslevel' },
                Authorized: { text: 'Authorized' },
                AzureadIntegrated: { key: 'azureadIntegrated' },
            }),
            ...prefixAllTranslationKeys('basics.company.', {
                BasCompanyFk: { key: 'entityBasCompanyFk' },
            })
        },
    }    
});