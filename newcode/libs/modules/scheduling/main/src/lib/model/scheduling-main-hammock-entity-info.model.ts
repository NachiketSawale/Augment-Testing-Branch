/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, IHammockActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainHammockDataService } from '../services/scheduling-main-hammock-data.service';
import { ILayoutConfiguration } from '@libs/ui/common';

export const SCHEDULING_MAIN_HAMMOCK_ENTITY_INFO: EntityInfo = EntityInfo.create<IHammockActivityEntity> ({
	//TODO Add conditions for Enable and Disable of Create/Delete Buttons

	grid: {
		title: {key: 'scheduling.main' + '.hammockListTitle'},
	},
	form: {
		title: { key: 'scheduling.main' + '.hammockDetailTitle' },
		containerUuid: 'd0cfd4e89e634a4fb99c8a14c6fa057e',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainHammockDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'HammockActivityDto'},
	permissionUuid: '221f0cc18f014d608cfb9acef1de4bb5',
	layoutConfiguration: async ctx=> {
		const activityLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IHammockActivityEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['ActivityMemberFk', 'CommentText']
				}
			],
			overloads: {
				ActivityMemberFk: activityLookupProvider.generateGridActivityLookup({
					showClearButton: true
				})
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					ActivityMemberFk: {key: 'assignedActivity'},
					CommentText: {key: 'commentContainerTitle'},
				}),
			}
		};
	}
});