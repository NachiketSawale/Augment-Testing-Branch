/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { UsermanagementRole2roleDataService } from '../services/usermanagement-role-2role-data.service';
import { IAccessRole2RoleEntity } from './entities/access-role-2role-entity.interface';
import { ROLE_LOOKUP_PROVIDER_TOKEN } from '@libs/usermanagement/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


export const USERMANAGEMENT_ROLE_2ROLE_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccessRole2RoleEntity>({
	grid: {
		title: { key: 'usermanagement.right.roleXRoleContainerTitle' },
	},
	form:{
		containerUuid:'bedf1ad181c4408cb868850aeab9d29a',
		title:'usermanagement.right.roleXRoleDetailsContainerTitle',
	},
	dataService: (ctx) => ctx.injector.get(UsermanagementRole2roleDataService),
	dtoSchemeId: { moduleSubModule: 'UserManagement.Main', typeName: 'AccessRole2RoleDto' },
	permissionUuid: 'bb7aa9b67e8740f0b6968ce7170d5a99',
	layoutConfiguration: async ctx => {
		const roleLookupProvider = await ctx.lazyInjector.inject(ROLE_LOOKUP_PROVIDER_TOKEN);
		const basicFields: (keyof IAccessRole2RoleEntity)[] = ['AccessRoleFk1', 'AccessRoleFk2'];

		return <ILayoutConfiguration<IAccessRole2RoleEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: basicFields,
				},
			],
			labels: {
				...prefixAllTranslationKeys('usermanagement.right.', {
					AccessRoleFk1: {
						key: 'accessRoleFK',
						text: 'Role',
					},
					AccessRoleFk2: {
						key: 'roleDescription',
						text: 'Role Description',
					},
				}),
			},
			overloads: {
				AccessRoleFk1: roleLookupProvider.generateRoleLookup(),
				AccessRoleFk2: {
					...roleLookupProvider.generateRoleLookup(),
					readonly: true
				}
			}
		};
	}
});
