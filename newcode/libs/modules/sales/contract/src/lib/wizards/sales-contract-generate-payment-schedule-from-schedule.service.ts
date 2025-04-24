/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createLookup, FieldType, FormStep, GridApiService, IFieldValueChangeInfo, IFormConfig, IGridConfiguration, MultistepDialog, UiCommonFormDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';



@Injectable({
	providedIn: 'root'
})
export class SalesContractGeneratePaymentScheduleFromScheduleWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	private readonly wizardDialogService = inject(UiCommonMultistepDialogService);
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private readonly injector = inject(Injector);

	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	protected formConfig: IFormConfig<ISalesGeneratePaymentScheduleFromScheduleEntity> = { rows: [] };
	private formData: ISalesGeneratePaymentScheduleFromScheduleEntity = {
		Step1: {
			ProjectFk: null,
			ScheduleFk: null
		},
		Step2: {
			DaysOffset: 0,
			ActivityIdsObj: [],
			SummaryIdsObj: [],
			AfterOrBefore: 0,
			DayType: ''
		},
	};
	private activities: IActivityEntity[] = [];

	private createActivityGridConfiguration(): IGridConfiguration<IActivityEntity> {
		return {
			uuid: '80c746ac23144cda8aae0dad9253635f',
			items: [],
			columns: [
				{
					id: 'id',
					model: 'IsChecked',
					type: FieldType.Boolean,
					readonly: false,
					sortable: false,
					visible: true,
					width: 50,
					label: {
						text: 'Selected',
						key: 'cloud.common.entityChecked'
					},
					// validator: (info: FieldValidationInfo<IActivityEntity>): ValidationResult => {
					// 	this.validateIsChecked(info.entity, info.value);
					// 	return new ValidationResult();
					// }
				}, {
					id: 'code',
					model: 'Code',
					type: FieldType.Code,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode'
					}
				},
				{
					id: 'description',
					model: 'Description',
					type: FieldType.Description,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription'
					}
				},
				{
					id: 'plannedStart',
					model: 'PlannedStart',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 100,
					label: {
						text: 'PlannedStart',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.plannedStart'
					}
				},
				{
					id: 'plannedFinish',
					model: 'PlannedFinish',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 100,
					label: {
						text: 'PlannedFinish',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.plannedFinish'
					}
				},
				{
					id: 'actualStart',
					model: 'ActualStart',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'ActualStart',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.actualStart'
					}
				},
				{
					id: 'actualFinish',
					model: 'ActualFinish',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'ActualFinish',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.actualFinish'
					}
				},
				{
					id: 'currentStart',
					model: 'CurrentStart',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'CurrentStart',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.currentStart'
					}
				},
				{
					id: 'currentFinish',
					model: 'CurrentFinish',
					type: FieldType.DateUtc,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'CurrentFinish',
						key: 'sales.contract.generatePaymentScheduleFromSchedule.currentFinish'
					}
				}
			],
		};
	}
	private step1: IFormConfig<IStep1> = {
		formId: 'sales.contract.generatePaymentScheduleFromSchedule.dialog',
		showGrouping: false,
		rows: [
			{
				id: 'ProjectFk',
				label: { text: 'Project', key: 'Project' },
				type: FieldType.Lookup,
				lookupOptions: createLookup(
					{
						dataServiceToken: ProjectSharedLookupService,
						events: [

						]
					}
				),
				model: 'ProjectFk',
				sortOrder: 1
			},
			{
				id: 'ScheduleFk',
				label: { text: 'Schedule', key: 'Schedule' },
				type: FieldType.Lookup,
				lookupOptions: createLookup(
					{
						dataServiceToken: SchedulingScheduleLookup
					}
				),
				model: 'ScheduleFk',
				sortOrder: 2
			}

		],
	};

	private step2: IFormConfig<IStep2> = {
		formId: '',
		showGrouping: false,
		rows: [
			{
				id: 'GenerateOpt',
				label: {
					key: this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.generateOptions').text
				},
				type: FieldType.Radio,
				model: 'GenerateOpt',
				itemsSource: {
					items: [
						{
							id: GenerateOptionsRadio.fromActivityOnly,
							displayName: this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.fromActivityOnly').text,
						},
						{
							id: GenerateOptionsRadio.fromSummaryOnly,
							displayName: this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.fromSummaryOnly').text,
						},
						{
							id: GenerateOptionsRadio.fromSummaryNActivity,
							displayName: this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.fromSummary&Activity').text

						},
					],
				},
				change: (changeInfo) => {
					this.onGenerateOptionsRadioChange(changeInfo);
				}
			},
			{
				id: 'activityIdsObj',
				type: FieldType.Grid,
				configuration: this.createActivityGridConfiguration() as IGridConfiguration<object>,
				height: 120,
				model: 'ActivityIdsObj',
				visible: true,

			},
			{
				groupId: 'daysOffset',
				id: 'DaysOffset',
				label: {
					text: 'Days Offset',
					key: 'sales.contract.generatePaymentScheduleFromSchedule.daysOffset',
				},
				type: FieldType.Integer,
				model: 'DaysOffset',
				visible: true,
			},
			{
				id: 'dayType',
				type: FieldType.Lookup,
				label: {
					text: 'Days',
					key: 'sales.contract.generatePaymentScheduleFromSchedule.days',
				},
				model: 'DayType',
				lookupOptions: createLookup({
					dataService: this.lookupServiceFactory.fromItems(
						[
							{
								code: DayTypeOptions.plannedStart,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.plannedStart',
								}
							},
							{
								code: DayTypeOptions.PlannedFinish,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.plannedFinish',
								}
							},
							{
								code: DayTypeOptions.actualStart,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.actualStart',
								}
							},
							{
								code: DayTypeOptions.actualFinish,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.actualFinish',
								}
							},
							{
								code: DayTypeOptions.currentStart,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.currentStart',
								}
							},
							{
								code: DayTypeOptions.currentFinish,
								description: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.currentFinish',
								}
							},
						],
						{
							uuid: 'cb080b28-adea-4d07-add5-6f370e860110',
							valueMember: 'code',
							displayMember: 'description',
							translateDisplayMember: true
						}
					)
				}),
			},
			{
				id: 'afterOrBefore',
				type: FieldType.Lookup,
				label: {
					text: 'Days',
					key: 'sales.contract.generatePaymentScheduleFromSchedule.days',
				},
				model: 'AfterOrBefore',
				lookupOptions: createLookup({
					dataService: this.lookupServiceFactory.fromItems(
						[
							{
								id: AfterBeforeOptions.after,
								desc: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.after',
								}
							},
							{
								id: AfterBeforeOptions.before,
								desc: {
									key: 'sales.contract.generatePaymentScheduleFromSchedule.before',
								}
							}

						],
						{
							uuid: 'cb080b28-adea-4d07-add5-6f370e860110',
							valueMember: 'id',
							displayMember: 'desc',
							translateDisplayMember: true
						}
					)
				}),
				change: (changeInfo) => {

				}
			},
		]
	};

	public generatePaymentScheduleFromSchedule() {
		this.showGeneratePaymentScheduleFromScheduleDialog();
	}


	public async showGeneratePaymentScheduleFromScheduleDialog() {
		const stepForm1 = new FormStep('step1', this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.title'), this.step1, 'Step1');
		const stepForm2 = new FormStep('step2', this.translateService.instant('sales.contract.generatePaymentScheduleFromSchedule.title'), this.step2, 'Step2');
		const multistepDialog = new MultistepDialog(this.formData, [stepForm1, stepForm2]);
		const btns = multistepDialog.dialogOptions?.buttons;
		if (btns) {
			btns[1] = {
				id: 'Next',
				caption: { text: 'Next' },
				isDisabled: (info) => {
					if (info.dialog.value?.stepIndex === 0) {
						return !info.dialog.value?.dataItem?.Step1.ProjectFk || !info.dialog.value?.dataItem?.Step1.ScheduleFk;
					}
					if (info.dialog.value?.stepIndex === 1) {
						return true;
					}
					return true;
				},
				fn: async (event, info) => {
					info.dialog.value?.goToNext();
					if (info.dialog.value) {
						await this.onClickNext(info.dialog.value);
					}
				},
			};
			btns[2] = {
				id: 'Ok',
				caption: { text: 'Ok' },
				isDisabled: (info) => {
					return !(info.dialog.value?.stepIndex === 1);
				},
				fn: async (event, info) => {
					if (info.dialog.value) {
						await this.onSubmit(info.dialog.value);
					}
				},
				autoClose: true,
			};
		}
		await this.wizardDialogService.showDialog(multistepDialog);
	}
	private async onClickNext(dialog: MultistepDialog<ISalesGeneratePaymentScheduleFromScheduleEntity>) {
		this.http.get(this.configService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=schedulingactivity&filtervalue=(ScheduleFk=' + dialog.dataItem.Step1.ScheduleFk + ')').subscribe((res) => {
			const activityGrid = this.injector.get(GridApiService).get('80c746ac23144cda8aae0dad9253635f');
			activityGrid.items.push(res);
		});
	}
	private async onSubmit(info: MultistepDialog<ISalesGeneratePaymentScheduleFromScheduleEntity>) {
		const activityParams: IActivityParams[] = [];
		info.dataItem.Step2.ActivityIdsObj.forEach((item: IActivityEntity) => {
			//TODO
			// var addDays = info.dataItem.Step2.AfterOrBefore * info.dataItem.Step2.DaysOffset;
			// var calDate = item[info.dataItem.Step2.dayType].addDays(addDays).DateUtc();
			activityParams.push({
				ActivityId: item.Id,
				SummaryActivityIds: info.dataItem.Step2.GenerateOpt === GenerateOptionsRadio.fromSummaryOnly ? [] : []
			});
		});
		const params = {
			OrdHeaderProjectFk: this.headerDataService.getSelectedEntity()?.ProjectFk,
			ScheduleFk: info.dataItem.Step1.ScheduleFk,
			GenerateOption: info.dataItem.Step2.GenerateOpt,
			OrdHeaderFk: this.headerDataService.getSelectedEntity()?.Id,
			SelectedProjectFk: info.dataItem.Step1.ProjectFk,
			CurrentFk: this.headerDataService.getSelectedEntity()?.CurrencyFk,
			ActivityParams: activityParams,
		};

		this.http.post(this.configService.webApiBaseUrl + 'sales/contract/paymentschedule/generatepaymentschedulefromschedule', params).subscribe((res) => {
			this.messageBoxService.showInfoBox('Generate Payment Schedule Successfully.', 'info', true);
			this.headerDataService.refreshSelected();
			return;
		});
	}
	private onGenerateOptionsRadioChange(option: IFieldValueChangeInfo<IStep2, PropertyType>) {
		if (option.newValue === GenerateOptionsRadio.fromActivityOnly) {
			editableSummaryAndActivity(this.activities);
		}
		if (option.newValue === GenerateOptionsRadio.fromSummaryOnly) {
			editableAllSummary(this.activities);
		}
		if (option.newValue === GenerateOptionsRadio.fromSummaryNActivity) {
			editableSummaryAndActivity(this.activities);
		}
	}

}

function editableSummaryAndActivity(activities: IActivityEntity[]) {
	const childProp = 'Activities';

	activities.forEach((item: IActivityEntity) => {
		if (item[childProp] && item[childProp].length) {
			editableSummaryAndActivity(item[childProp]);
		}
	});
}

function editableAllSummary(activities: IActivityEntity[]) {
	const childProp = 'Activities';
	activities.forEach((item: IActivityEntity) => {
		if (item[childProp] && item[childProp].length) {
			editableSummaryAndActivity(item[childProp]);
		}
	});
}

export interface ISalesGeneratePaymentScheduleFromScheduleEntity {
	Step1: IStep1;
	Step2: IStep2;
}
export interface IStep1 {
	ProjectFk?: number | null;
	ScheduleFk?: number | null;

}
export interface IStep2 {
	GenerateOpt?: number;
	ActivityIdsObj: [],
	SummaryIdsObj: [],
	AfterOrBefore: number | null,
	DayType: string | null,
	DaysOffset: number | null;
}
export interface IActivityParams {
	ActivityId: number,
	SummaryActivityIds: [],
}
export enum DayTypeOptions {
	plannedStart = 1,
	PlannedFinish = 2,
	actualStart = 3,
	actualFinish = 4,
	currentStart = 5,
	currentFinish = 6
}
export enum AfterBeforeOptions {
	after = 1,
	before = 2

}
export enum GenerateOptionsRadio {
	fromActivityOnly = 1,
	fromSummaryOnly = 2,
	fromSummaryNActivity = 3

}

