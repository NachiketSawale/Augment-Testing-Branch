/*
* Copyright(c) RIB Software GmbH
*/

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { UsermanagementUser2groupDataService } from '../services/usermanagement-user-2group-data.service';
import { GROUP_LOOKUP_PROVIDER_TOKEN, IAccessUsersInGroupEntity } from '@libs/usermanagement/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


export const ACCESS_USER2_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccessUsersInGroupEntity>({
	dtoSchemeId: {
		moduleSubModule: 'UserManagement.Main',
		typeName: 'AccessUser2GroupDto'
	},
	grid: {
		title: {key: 'usermanagement.user.user2GroupContainerTitle'},
	},
	permissionUuid: '1d1f0228f8ee47c697e82789029cc15a',
	dataService: ctx => ctx.injector.get(UsermanagementUser2groupDataService),
	layoutConfiguration: async ctx => {
		const groupLookupProvider = await ctx.lazyInjector.inject(GROUP_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IAccessUsersInGroupEntity>>{
			groups: [{
				gid: 'basicData',
				title: {
					key: 'usermanagement.user.userXgroup.detailform',
				},
				attributes: ['AccessGroupFk', 'Description']
			}],
			overloads: {
				AccessGroupFk: groupLookupProvider.generateGroupLookup()
			},
			labels: {
				...prefixAllTranslationKeys('usermanagement.user.', {
					AccessGroupFk: {key: 'accessGroupFK'}
				})
			}
			//TODO: implementation of extendGroupingFn (Description, DomainSID)
		};
	}
});