
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectCalendarEntity, PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { CALENDAR_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';

/**
 * Material group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProjectCalendarLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public async generateLayout():Promise<ILayoutConfiguration<IProjectCalendarEntity>> {
		const projectLookupProvider = await this.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		const calendarLookupProvider = await this.lazyInjector.inject(CALENDAR_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'text': 'Basic Data',
						'key': 'cloud.common.entityProperties'
					},
					'attributes': [
						'CalendarFk',
						'CalendarSourceFk',
						'CalendarTypeFk',
						'Comment',
						'ProjectFk'
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('project.calendar.', {
					CalendarTypeFk: {key: 'entityCalendarTypeFk'},
					CalendarSourceFk: {key: 'calendarSourceFk'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ProjectFk:{key:'entityProject'},
					Comment: {key: 'entityComment'},
					CalendarFk: {key: 'entityCalCalendarFk'}
				})
			},
			overloads: {
				CalendarTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCalendarTypeLookupOverload(false),
				ProjectFk: {
					...projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							showClearButton: true,
						},
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								text: 'ProjectName',
								key: 'cloud.common.entityProjectName',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				CalendarFk: calendarLookupProvider.generateCalendarLookup(),
				CalendarSourceFk: calendarLookupProvider.generateCalendarLookup(),
			},
		};
	}
}