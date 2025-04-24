/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsConfigNavbarSystemDataService } from '../services/basics-config-navbar-system-data.service';
import { INavbarConfigEntity } from './entities/navbar-config-entity.interface';
import { FieldType, createLookup } from '@libs/ui/common';
import { BasicsConfigNavbarSystemLookupService } from '../services/lookup/basics-config-navbar-system-lookup.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Basics Config Navbar System entity info.
 */
export const BASICS_CONFIG_NAVBAR_SYSTEM_ENTITY_INFO: EntityInfo = EntityInfo.create<INavbarConfigEntity>({
    grid: {
        title: { key: 'basics.config.navbarSystemContainerTitle' },
    },
    dataService: ctx => ctx.injector.get(BasicsConfigNavbarSystemDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'NavbarConfigDto' },
    permissionUuid: 'ed4dcf0163594a208772a701f1cb6ac3',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data'
                },
                attributes: [
                    'BasBarItemFk',
                    'Sorting',
                    'Visibility',
                    'IsMenueItem'
                ]
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.config.', {
                BasBarItemFk: {
                    key: 'barItemFk',
                },
                Sorting: {
                    key: 'tabSorting',
                },
                Visibility: {
                    key: 'barvisibility',
                },
                IsMenueItem: {
                    key: 'isMenueItem',
                },
            }),
        },
        overloads: {
            BasBarItemFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsConfigNavbarSystemLookupService
                })
            },
        }
    }

});
