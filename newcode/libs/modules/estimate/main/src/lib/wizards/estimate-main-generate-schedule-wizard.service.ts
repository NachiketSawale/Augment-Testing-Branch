/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService, createLookup } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IGenerateScheduleCategory } from '../model/interfaces/estimate-main-generate-schedule-category.interface';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { SchedulingProjectExecutionScheduleLookup } from '@libs/scheduling/shared';

@Injectable({ providedIn: 'root' })

/**
 * Estimate Main Generate Schedule Wizard
 * This service provides functionality for Generate Schedule Wizard
 */
export class EstimateMainGenerateScheduleWizardService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private selectedItem: IEstLineItemEntity | null = null;
	private parentService = inject(EstimateMainService);
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * This method displays a dialog
	 * @returns
	 */
	public async generateSchedule() {
		this.selectedItem = this.parentService.getSelectedEntity();

		if (!this.selectedItem) {
			this.messageBoxService.showMsgBox('estimate.main.noCurrentLineItemSelection', 'estimate.main.generateSchedule', 'ico-info', 'message', false);
			return; // Early return to prevent further execution
		} else {
			const url = this.configService.webApiBaseUrl + 'scheduling/schedule/getcode?projectId=' + this.selectedItem.ProjectFk;

			this.http.get(url, { responseType: 'text' }).subscribe({
				next: (response: string) => {
					this.defaultItem.Code = response;

					this.formDialogService
						.showDialog<IGenerateScheduleCategory>({
							id: 'defaultItem',
							headerText: this.setHeader(),
							formConfiguration: this.generateScheduleformConfiguration,
							entity: this.defaultItem,
							showCancelButton: this.disableCancelButton(),
							showOkButton: this.disableOkButton(),
						})
						?.then((result) => {
							if (result?.closingButtonId === StandardDialogButtonId.Ok) {
								this.handleOK();
							}
						});
				},
			});
		}
	}

	/**
	 * This method set the header for the Generate Schedule wizard
	 * @returns
	 */
	public setHeader(): string {
		return 'estimate.main.generateSchedule';
	}

	/**
	 * This function checks whether the Ok button should be disabled based on certain conditions
	 * @returns
	 */
	private disableOkButton(): boolean {
		let result = false;

		if (!this.defaultItem.TemplateProjectFk || !this.defaultItem.TemplateScheduleFk || (this.defaultItem && this.defaultItem.Code !== null && this.defaultItem.Code !== undefined)) {
			result = true;
		}

		return result;
	}

	/**
	 * This function determines whether the Cancel button should be disabled
	 * @returns
	 */
	private disableCancelButton(): boolean {
		const result = false;
		return result;
	}

	/**
	 * Setting up default values to default item
	 */
	private defaultItem: IGenerateScheduleCategory = {
		TemplateProjectFk: 0,
		TemplateScheduleFk: 0,
		StartDate: new Date(),
		UseTargetProjectCalendar: true,
		UseLineItemQuantity: true,
		UseLineItemTime: true,
		EstimateHeaderId: 0,
		Code: ''
	};

	/**
	 * This method prepares the form configuration for the specified value
	 * @returns
	 */
	private generateScheduleformConfiguration: IFormConfig<IGenerateScheduleCategory> = {
		formId: 'estimate.main.generateScheduleWizard',
		showGrouping: false,
		groups: [
			{
				groupId: 'baseGroup',
				header: { key: 'estimate.main.generateSchedule' },
				open: true
			},
		],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'templateProjectFk',
				label: {
					key: 'project.main.templateProject',
				},
				sortOrder: 1,
				type: FieldType.Description,
				model: 'TemplateProjectFk',
				// todo lookup projectTemplateLookupDataService not implemented
			},

			{
				groupId: 'baseGroup',
				id: 'templateScheduleFk',
				label: {
					key: 'scheduling.schedule.scheduleEntity',
				},
				sortOrder: 2,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SchedulingProjectExecutionScheduleLookup,
				}),
				model: 'TemplateScheduleFk'
			},

			{
				groupId: 'baseGroup',
				id: 'startDate',
				label: {
					key: 'cloud.common.entityStartDate'
				},
				sortOrder: 3,
				type: FieldType.Date,
				model: 'StartDate'
			},

			{
				groupId: 'baseGroup',
				id: 'useTargetProjectCalendar',
				label: {
					key: 'estimate.main.useProjectCalendar'
				},
				sortOrder: 4,
				type: FieldType.Boolean,
				model: 'UseTargetProjectCalendar'
			},

			{
				groupId: 'baseGroup',
				id: 'useLineItemQuantity',
				label: {
					key: 'estimate.main.useLineItemQuantity'
				},
				sortOrder: 5,
				type: FieldType.Boolean,
				model: 'UseLineItemQuantity'
			},

			{
				groupId: 'baseGroup',
				id: 'useLineItemTime',
				label: {
					key: 'estimate.main.useLineItemTime'
				},
				sortOrder: 6,
				type: FieldType.Boolean,
				model: 'UseLineItemTime'
			},

			{
				groupId: 'baseGroup',
				id: 'code',
				label: {
					key: 'cloud.common.entityCode'
				},
				sortOrder: 7,
				type: FieldType.Code,
				model: 'Code'

				// 	asyncValidator: function(entity, value, model)
			},
		],
	};

	/**
	 * This method gives functionality to Ok button
	 * @param value
	 * @returns
	 */
	private handleOK() {
		const createSchedule = {
			TemplateProjectFk: this.defaultItem.TemplateProjectFk,
			TemplateScheduleFk: this.defaultItem.TemplateScheduleFk,
			StartDate: this.defaultItem.StartDate,
			UseTargetProjectCalendar: this.defaultItem.UseTargetProjectCalendar,
			UseLineItemQuantity: this.defaultItem.UseLineItemQuantity,
			UseLineItemTime: this.defaultItem.UseLineItemTime,
			EstimateHeaderId: this.parentService.getSelectedEntity(),
			Code: this.defaultItem.Code
		};

		this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitem/generateschedulefromestheader', createSchedule).subscribe((response) => {
			/* On succeded message to display */
			const numberOfGeneratedActivities = response;
			const bodyText = `estimate.main.numberOfGeneratedActivities ${numberOfGeneratedActivities.toString()}`;

			/* Concatenate the message with the number converted to string */
			this.messageBoxService.showMsgBox(bodyText, 'estimate.main.generateSchedule ', 'ico-info', 'message', false);
		});
	}
}
