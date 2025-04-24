/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSchedulingWeekDayDataService } from '@libs/project/calendar';
import { ISchedulingWeekdayEntity } from '@libs/project/interfaces';

export const ProjectSchedulingWeekdayEntityInfoModel: EntityInfo = EntityInfo.create<ISchedulingWeekdayEntity>({
	grid: {
		title: {key: 'scheduling.calendar.weekdayListHeader'},
	},
	form: {
		title: {key: 'scheduling.calendar.weekdayDetailHeader'},
		containerUuid: '4196114c284b49efac5b4431bf9836b4',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingWeekDayDataService),
	//validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingCalendarValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Calendar', typeName: 'WeekdayDto'},
	permissionUuid: '4196114c284b49efac5b4431bf9836b2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [ 'AcronymInfo','WeekdayIndex','DescriptionInfo','Sorting','IsWeekend','BackgroundColor','FontColor'],
			}
		],
		overloads: {
		},
		labels: {
			...prefixAllTranslationKeys('scheduling.calendar.', {
				AcronymInfo: { key: 'entityAcronym'},
				WeekdayIndex:{key:'entityAcronym'},
				IsWeekend:{key:'entityIsWeekend'},
				BackgroundColor:{key:'entityBackgroundColor'},
				FontColor:{key:'entityFontColor'}
			})
		},
	},
});