/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEventEntity, SCHEDULING_MAIN_EVENT_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingMainEventDataService } from '../services/scheduling-main-event-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingMainEventValidationService } from '../services/validations/scheduling-main-event-validation.service';

export const SCHEDULING_MAIN_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.eventListTitle'},
	},
	form: {
		title: { key: 'scheduling.main' + '.eventDetailTitle' },
		containerUuid: 'e006376f2dba4a8d97d6bab94f1e36e0',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainEventDataService),
	validationService: ctx => ctx.injector.get(SchedulingMainEventValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'EventDto'},
	permissionUuid: '578f759af73e4a6aa22089975d3889ac',
	layoutConfiguration: async ctx => {
		const eventLookupProvider = await ctx.lazyInjector.inject(SCHEDULING_MAIN_EVENT_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IEventEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['EventTypeFk', 'Description', 'Date', 'IsFixedDate', 'EventFk', 'PlacedBefore', 'DistanceTo', 'IsDisplayed']
				}
			],
			overloads: {
				EventTypeFk: BasicsSharedLookupOverloadProvider.provideEventTypeLookupOverload(true),
				EventFk: eventLookupProvider.generateSchedulingMainEventLookup({
					preloadTranslation: 'scheduling.main.eventFk',
					showClearButton: true
				})
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					PlacedBefore: {key: 'PlacedBefore'},
					DistanceTo: {key: 'DistanceTo'},
					IsDisplayed: {key: 'IsDisplayed'},
					IsFixedDate: {key: 'IsFixedDate'},
					EventTypeFk: {key: 'entityEventType'},
					EventFk: {key: 'eventFk'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Date: {key: 'entityDate'}
				})
			}
		};
	}
});