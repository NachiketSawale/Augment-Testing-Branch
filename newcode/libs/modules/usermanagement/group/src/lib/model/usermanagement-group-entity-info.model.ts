/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { UsermanagementGroupDataService } from '../services/usermanagement-group-data.service';
import { UsermanagementGroupLayoutService } from '../services/usermanagement-group-layout.service';
import { IAccessGroupEntity } from './entities/access-group-entity.interface';


 export const USERMANAGEMENT_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccessGroupEntity> ({
                grid: {
                    title: {key: 'usermanagement.group.groupContainerTitle'},
                },
                dataService: ctx => ctx.injector.get(UsermanagementGroupDataService),
                dtoSchemeId: {moduleSubModule: 'UserManagement.Main', typeName: 'AccessGroupDto'},
                permissionUuid: '60d295ef1a2c4d0788c17f2bd0696400',
                layoutConfiguration: ctx =>{
                    return ctx.injector.get(UsermanagementGroupLayoutService).generateLayout();
                }
            });