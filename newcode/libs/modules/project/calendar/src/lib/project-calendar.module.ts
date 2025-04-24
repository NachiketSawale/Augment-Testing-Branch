import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSchedulingCalendarDataService } from './services/project-scheduling-calendar-data.service';
@NgModule({
	imports: [CommonModule],
	providers: [
		{ provide: 'SCHEDULE_CALENDAR_PARENT_SERVICE', useExisting: ProjectSchedulingCalendarDataService }
	],
})
export class ProjectCalendarModule {}
