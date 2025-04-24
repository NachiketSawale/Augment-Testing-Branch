/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { addUserDefinedTextTranslation, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSchedulingCalendarDataService } from '@libs/project/calendar';
import { ISchedulingCalendarEntity } from '@libs/project/interfaces';

export const ProjectSchedulingCalendarEntityInfo: EntityInfo = EntityInfo.create<ISchedulingCalendarEntity>({
	grid: {
		title: {text: 'Scheduling Calendar' ,key: 'scheduling.calendar.calendarGridHeader'},
	},
	form: {
		title: {text: 'Scheduling Calendar Details' ,key: 'scheduling.calendar.calendarDetailTitle'},
		containerUuid: '506FC12756F8439E8FECB7EE4B360538',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingCalendarDataService),
	//validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingCalendarValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Calendar', typeName: 'CalendarDto'},
	permissionUuid: 'afecdb4a08404395855258b70652d04b',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [ 'Code','CommentText','CalendarTypeFk','IsDefault',
					'WorkHourDefinesWorkDay','BasUomHourFk','BasUomDayFk','WorkHoursPerDay','WorkHoursPerWeek',
					'WorkHoursPerMonth','WorkHoursPerYear','IsLive',/*'BasUomWorkDayFk','BasUomWeekFk','BasUomMonthFk',
					'BasUomYearFk','BasUomMinuteFk',*/'DescriptionInfo'
				],
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05']
			},
		],
		overloads: {

		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code :{ key: 'entityCode'},
				userDefTexts: {key: 'UserdefTexts'},
				IsDefault: {key: 'entityIsDefault'},
			}),

			...prefixAllTranslationKeys('basics.customize.', {
				CalendarTypeFk: {key: 'calendartype'},
			}),
			...prefixAllTranslationKeys('project.main.', {
				CommentText :{ key: 'entityCommentText'},
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),

			...prefixAllTranslationKeys('scheduling.calendar.', {
				WorkHourDefinesWorkDay:{key: 'entityWorkHourDefinesWorkDay'},
				BasUomHourFk:{key: 'entityBasUomHour'},
				BasUomDayFk:{key: 'entityBasUomDay'},
				WorkHoursPerDay:{key: 'entityWorkHoursPerDay'},
				WorkHoursPerWeek:{key: 'entityWorkHoursPerWeek'},
				WorkHoursPerMonth:{key: 'entityWorkHoursPerMonth'},
				WorkHoursPerYear:{key: 'entityWorkHoursPerYear'},
				IsLive:{key: 'entityIsLive'},
			})
		},
	},
});