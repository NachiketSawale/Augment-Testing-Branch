/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSchedulingWorkDataService } from '@libs/project/calendar';
import { ISchedulingWorkEntity } from '@libs/project/interfaces';
import { createLookup, FieldType } from '@libs/ui/common';
import { SchedulingCalendarLookup } from '@libs/scheduling/shared';

export const ProjectSchedulingWorkEntityInfoModel: EntityInfo = EntityInfo.create<ISchedulingWorkEntity>({
	grid: {
		title: {key: 'scheduling.calendar.entityWorkHours'},
	},
	form: {
		title: {key: 'scheduling.calendar.entityWorkHoursDetails'},
		containerUuid: '50D82415E24C47ACA182C0F634EE9520',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingWorkDataService),
	//validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingCalendarValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Calendar', typeName: 'WorkHourDto'},
	permissionUuid: '50d82415e24c47aca182c0f634ee9515',
	layoutConfiguration: {
		groups: [{gid: 'default-group', attributes: ['WeekdayFk','IsWorkingDay']}
		],
		overloads: {
			WeekdayFk:{
				type:FieldType.Lookup,
				lookupOptions:createLookup({
					dataServiceToken:SchedulingCalendarLookup,
					displayMember:'AcronymInfo.Description',
					valueMember:'Id'}
				)},
			IsWorkingDay:{visible:true,readonly:true}
		},
		labels :{
			...prefixAllTranslationKeys('scheduling.calendar.', {
				WeekdayFk: { key: 'entityWeekday' },
				WorkStart: { key: 'entityWorkStart' },
				WorkEnd: { key: 'entityWorkEnd' },
				IsWorkingDay:{key:'entityIsWorkingDay'}
			})
		}
	},
});