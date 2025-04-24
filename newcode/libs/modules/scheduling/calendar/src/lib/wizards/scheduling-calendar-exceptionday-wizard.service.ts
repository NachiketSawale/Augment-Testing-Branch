/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, FormRow, IFormConfig, IFormDialogConfig, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { PlatformHttpService, RgbColor } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { ISchedulingCalendarEntity, SchedulingCalendarComplete } from '@libs/scheduling/interfaces';

export interface IExceptionDayEntity{
	Action: number;
	Calendars: string;
	StartDate: Date | null;
	EndDate:Date | null;
	NumberOf:number;
	Description:string;
	CommentText:string;
	BackgroundColor:RgbColor;
	FontColor:RgbColor;
	IsShownInChart:boolean;
	IsWorkday:boolean;
	WorkStart:Date | null;
	WorkEnd:Date | null;
}

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarExceptiondayWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SchedulingCalendarDataService);

	public async createExceptionDays(wizardParameter: number): Promise<void> {
		const selections: ISchedulingCalendarEntity = this.dataService.getSelection()[0];
		if (!selections) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		} else {
			await this.prepareFormData(selections, wizardParameter);
		}
	}

	private async prepareFormData(selections: ISchedulingCalendarEntity, wizardParameter: number): Promise<void> {
		enum WizardAction {
			createVacation = 1,
			createBankHoliday = 2,
			recurExceptionday = 3
		}
		let actionValue: WizardAction;
		switch (wizardParameter) {
			case WizardAction.createVacation:
				actionValue = WizardAction.createVacation;
				break;
			case WizardAction.createBankHoliday:
				actionValue = WizardAction.createBankHoliday;
				break;
			case WizardAction.recurExceptionday:
				actionValue = WizardAction.recurExceptionday;
				break;
			default:
				throw new Error(`Invalid wizardParameter: ${wizardParameter}`);
		}

		const calendarsIds: IExceptionDayEntity = {
			Action: actionValue,
			Calendars: selections.Code,
			StartDate: new Date(),
			EndDate: null,
			NumberOf: 1,
			Description: '',
			CommentText: '',
			BackgroundColor: new RgbColor(255, 255, 255, 1),
			FontColor: new RgbColor(0, 0, 0, 1),
			IsShownInChart: false,
			IsWorkday: false,
			WorkStart: null,
			WorkEnd: null
		};

		const config: IFormDialogConfig<IExceptionDayEntity> = {
			headerText: { text: 'Create Bank Holiday' },
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: calendarsIds
		};

		try {
			const result = await this.formDialogService.showDialog(config);
			if (result) {
				const selection = this.dataService.getSelection()[0];
				const postData = {
					Action: actionValue,
					StartDate: result.value?.StartDate,
					EndDate: result.value?.EndDate,
					NumberOf: result.value?.NumberOf,
					ExceptionDay: {
						Id: -1,
						BackgroundColor: 16777215,
						FontColor: 3355443,
						ExceptDate: Date.now(),
						CommentText: result.value?.CommentText,
						CalendarFk: selection.Id,
						WorkStart: result.value?.WorkStart,
						WorkEnd: result.value?.WorkEnd,
						IsWorkday: result.value?.IsWorkday,
						IsShownInChart: result.value?.IsShownInChart,
						Calendar: selection.Code
					},
					Calendars: this.dataService.getSelection()
				};

				await lastValueFrom(this.http.post$<SchedulingCalendarComplete>('scheduling/calendar/execute', postData));
			}
		} catch (error) {
			console.error('Error creating exception days:', error);
		}
	}


	private generateEditOptionRows(): IFormConfig<IExceptionDayEntity> {
		const formRows: FormRow<IExceptionDayEntity>[] = [
			{
				id: 'Calendars',
				label: {
					text: 'Calendars',
				},
				type: FieldType.Description,
				model: 'Calendars',
				readonly: true
			},
			{
				id: 'StartDate',
				label: {
					text: 'StartDate',
				},
				type: FieldType.Date,
				model: 'StartDate'
			},
			{
				id: 'NumberOf',
				label: {
					text: 'NumberOf',
				},
				type: FieldType.Integer,
				model: 'NumberOf'
			},
			{
				id: 'Description',
				label: {
					text: 'Description',
				},
				type: FieldType.Description,
				model: 'Description'
			},
			{
				id: 'CommentText',
				label: {
					text: 'CommentText',
				},
				type: FieldType.Comment,
				model: 'CommentText'
			},
			{
				id: 'IsShownInChart',
				label: {
					text: 'IsShownInChart',
				},
				type: FieldType.Boolean,
				model: 'IsShownInChart'
			},
			{
				id: 'IsWorkday',
				label: {
					text: 'IsWorkday',
				},
				type: FieldType.Boolean,
				model: 'IsWorkday'
			},
			{
				id: 'WorkStart',
				label: {
					text: 'WorkStart',
				},
				type: FieldType.Date,
				model: 'WorkStart',
				readonly: true
			},
			{
				id: 'WorkEnd',
				label: {
					text: 'WorkEnd',
				},
				type: FieldType.Date,
				model: 'WorkEnd',
				readonly: true
			},
			{
				id: 'FontColor',
				label: {
					text: 'FontColor',
				},
				type: FieldType.Color,
				model: 'FontColor'
			},
			{
				id: 'BackgroundColor',
				label: {
					text: 'BackgroundColor',
				},
				type: FieldType.Color,
				model: 'BackgroundColor'
			}
		];

		const formConfig: IFormConfig<IExceptionDayEntity> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}
}
