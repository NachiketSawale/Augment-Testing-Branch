import { EntityInfo } from '@libs/ui/business-base';
import { ProjectCalendarLayoutService, ProjectCalendarDataService } from '@libs/project/calendar';
import { IProjectCalendarEntity } from '@libs/project/interfaces';

export const PROJECT_CALENDARS_ENTITY_INFO = EntityInfo.create<IProjectCalendarEntity>({
	grid: {
		title: {key: 'project.calendar.calendarListTitle'},
	},
	form: {
		containerUuid: 'bc9bfd0c36bf4c4aa7f9f40d109e35c1',
		title: {key: 'project.calendar.calendarDetailTitle'},
	},
	dataService: ctx => ctx.injector.get(ProjectCalendarDataService),
	dtoSchemeId: { moduleSubModule: 'Project.Calendar', typeName: 'ProjectCalendarDto' },
	permissionUuid: '359b6aa7d45d45688229a7d6444b1b4c',
	layoutConfiguration: context => {
		return context.injector.get(ProjectCalendarLayoutService).generateLayout();
	}
});