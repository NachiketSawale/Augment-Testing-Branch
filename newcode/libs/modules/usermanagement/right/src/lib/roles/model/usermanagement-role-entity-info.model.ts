/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { UsermanagementRoleDataService } from '../services/usermanagement-role-data.service';
import { IAccessRoleEntity } from './entities/access-role-entity.interface';
import { UsermanagementRoleLayoutService } from '../services/usermanagement-role-layout.service';


 export const USERMANAGEMENT_ROLE_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccessRoleEntity> ({
                grid: {
                    title: {key: 'usermanagement.right.roleContainerTitle'},
                },

                dataService: ctx => ctx.injector.get(UsermanagementRoleDataService),
                dtoSchemeId: {moduleSubModule: 'UserManagement.Main', typeName: 'AccessRoleDto'},
                permissionUuid: '57ce3f7a22c546e4b3a3fce4a779975b',
                layoutConfiguration: ctx => {
                    return ctx.injector.get(UsermanagementRoleLayoutService).generateLayout();
                },

            });