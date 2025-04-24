/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ISchedulingCalendarExceptionDayEntity } from '@libs/scheduling/interfaces';
import { ProjectSchedulingExceptionDayDataService } from '@libs/project/calendar';

export const ProjectSchedulingExceptionDayEntityInfo: EntityInfo = EntityInfo.create<ISchedulingCalendarExceptionDayEntity>({
	grid: {
		title: {key: 'scheduling.calendar.exceptionListHeader'},
	},
	form: {
		title: {key: 'scheduling.calendar.exceptionDetailHeader'},
		containerUuid: '3978757e36bc49cba7e8a177272f2bfc',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingExceptionDayDataService),
	//validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectSchedulingCalendarValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Calendar', typeName: 'ExceptionDayDto'},
	permissionUuid: '3159c0a0c6d34287bf80fa1398f879ec',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [ 'Code','CommentText', 'ExceptDate','IsWorkday','BackgroundColor','FontColor','IsShownInChart','WorkStart','WorkEnd'],
			}
		],
		overloads: {
		},
		labels: {
			...prefixAllTranslationKeys('scheduling.calendar.', {
				ExceptDate: { key: 'entityExceptionDate'},
				IsWorkday:{key:'entityIsWorkingDay'},
				BackgroundColor:{key:'entityBackgroundColor'},
				FontColor:{key:'entityFontColor'},
				WorkStart:{ key: 'entityWorkStart'},
				WorkEnd:{ key: 'entityWorkEnd'},
				IsShownInChart : {key:'entityIsShownInChart'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode' },
				CommentText: { key: 'entityCommentText'}
			})
		},
	},
});