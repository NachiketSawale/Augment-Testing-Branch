/**
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { IAccessUsersInGroupEntity } from '@libs/usermanagement/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { UsermanagementUsersInGroupDataService } from '../services/usermanagement-users-in-group-data.service';
import { USER_LOOKUP_PROVIDER_TOKEN } from '@libs/usermanagement/interfaces';

/**
 * Usermanagement User in Group module info class
 */
export const USERMANAGEMENT_GROUP_USERS_IN_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccessUsersInGroupEntity>({
	dtoSchemeId: {
		moduleSubModule: 'UserManagement.Main',
		typeName: 'AccessUser2GroupDto'
	},
	grid: {
		title: {key: 'usermanagement.group.user2GroupContainerTitle'}
	},
	permissionUuid: '1d1f0228f8ee47c697e82789029cc15a',
	dataService: (ctx) => ctx.injector.get(UsermanagementUsersInGroupDataService),
	layoutConfiguration: async ctx => {
		const userLookupProvider = await ctx.lazyInjector.inject(USER_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IAccessUsersInGroupEntity>>{  //should this be a different enitity as in users case?
			groups: [
				{
					gid: 'default-group',
					title: {
						key: 'usermanagement.group.userXgroupdetailform',
					},
					attributes: ['Id', 'IdentityProvider', 'UserFk', 'AccessGroupFk', 'AccessGroupEntity', 'UserEntity'],
				},
			],
			overloads: {
				UserFk: userLookupProvider.generateUserLookup()
			},
			labels: {
				...prefixAllTranslationKeys('usermanagement.group.', {
					Id: {
						key: 'Id',
					},
					IdentityProvider: {
						key: 'identityProvider',
					},
					UserFk: {
						key: 'userFK',
					},
					AccessGroupFk: {
						key: 'accessGroupFK',
					},
					AccessGroupEntity: {
						key: 'AccessGroupEntity',
					},
					UserEntity: {
						key: 'userFK',
					}
				})
			}
			//TODO: implementation of extendGroupingFn (Description, DomainSID)
		};
	}
});
