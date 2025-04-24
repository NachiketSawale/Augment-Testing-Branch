/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService, PlatformHttpService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { ICreateProgressReportEntity } from '@libs/scheduling/interfaces';
import { SchedulingEntityExecutionHelper } from './common/scheduling-entity-execution-helper.class';

@Injectable({
	providedIn: 'root'
})

export class SchedulingAddProgressToScheduleActivitiesWizardService{
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private schedulingMainService = inject(SchedulingMainDataService);

 public addProgressToScheduledActivities(){
	 if (!this.schedulingMainService.getSelectedEntity()?.ScheduleFk){
		 SchedulingEntityExecutionHelper.openDialogFailed();
		 return;
	 }

	 this.formDialogService.showDialog<ICreateProgressReportEntity>({
		 headerText: 'scheduling.main.addProgressToScheduleActivity',
		 formConfiguration: this.getAddProgressToScheduleActivitiesFormConfiguration,
		 entity: this.addProgressToScheduleActivities,
		 runtime: undefined,
		 customButtons: [],
		 topDescription: '',
		 width: '1200px',
		 maxHeight: 'max',
	 })?.then((result: IEditorDialogResult<ICreateProgressReportEntity>) => {
		 if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			 this.addProgressToScheduleActivitiesHandleOK(result.value);
		 }
	 });

}
	private getAddProgressToScheduleActivitiesFormConfiguration: IFormConfig<ICreateProgressReportEntity> = {
		formId: 'scheduling.main.addProgress',
		showGrouping: false,
		groups: [

			{
				groupId: 'baseGroup',
				header: { key : 'scheduling.main.entityPerformanceDate'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: { key : 'timekeeping.period.fromDate'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: { key : 'scheduling.main.entityPortion'},
				open: true
			},
			{
				groupId: 'baseGroup',
				header: { key : 'cloud.common.entityDescription'},
				open: true
			},

		],
		rows: [
			{
				groupId: 'baseGroup',
				id:'reportdate',
				label: {
					key : 'scheduling.main.entityPerformanceDate',
				},
				type: FieldType.DateUtc,
				model:'ReportDate',
			},
			{
				groupId: 'baseGroup',
				id: 'portion',
				label: {
					key : 'scheduling.main.entityPortion',
				},
				type: FieldType.Integer,
				model: 'Portion',
			},
			{
				groupId: 'baseGroup',
				id: 'description',
				label: {
					key : 'cloud.common.entityDescription',
				},
				type: FieldType.Description,
				model: 'Description',
			},
		],

	};
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public addProgressToScheduleActivities: ICreateProgressReportEntity = {
		Portion: 0
	};
	private addProgressToScheduleActivitiesHandleOK(formEntity: ICreateProgressReportEntity): void {
		const scheduleId = this.schedulingMainService.getSelectedEntity()?.ScheduleFk;

		const action = {
			Action: 5,
			EffectedItemId: scheduleId,
			CreateData: formEntity
		};

		this.http.post('scheduling/main/activity/execute', action)
			.then(() => {
			/*	this.schedulingMainService.reload();*/ // TODo load function
				this.messageBoxService.showInfoBox(this.translate.instant('scheduling.main.doneSuccessfully').text, 'info', true);
			});

	}
}

