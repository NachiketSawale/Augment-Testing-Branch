/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, IEventEntity } from '@libs/scheduling/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SchedulingMainEventOverviewService } from '../../services/scheduling-main-event-overview.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ILayoutConfiguration } from '@libs/ui/common';

export const SCHEDULING_MAIN_EVENT_OVERVIEW_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.eventOverviewListTitle'},
		containerUuid: '013e7cb43b7f4986978905d431a25725',
	},
	form: {
		title: { key: 'scheduling.main' + '.eventOverviewDetailTitle' },
		containerUuid: '5bbf12317b5747a798ba710de91985e7',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainEventOverviewService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'EventDto'},
	permissionUuid: '578f759af73e4a6aa22089975d3889ac',
	layoutConfiguration: async ctx => {
		const activityLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IEventEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['EventTypeFk', 'Description', 'Date', 'IsFixedDate', 'PlacedBefore', 'DistanceTo', 'IsDisplayed', 'ActivityFk']
				}
			],
			overloads: {
				EventTypeFk: BasicsSharedLookupOverloadProvider.provideEventTypeReadonlyLookupOverload(),
				ActivityFk: activityLookupProvider.generateActivityLookup({
					readonly: true
				})
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					EventTypeFk: {key: 'entityEventType'},
					PlacedBefore: {key: 'PlacedBefore'},
					DistanceTo: {key: 'DistanceTo'},
					IsDisplayed: {key: 'IsDisplayed'},
					ActivityFk: {key: 'entityActivity'},
					IsFixedDate: {key: 'IsFixedDate'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Date: {key: 'entityDate'}
				})
			}
		};
	}
});