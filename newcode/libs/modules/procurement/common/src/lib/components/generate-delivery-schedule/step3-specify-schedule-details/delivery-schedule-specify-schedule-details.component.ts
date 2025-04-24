/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { PlatformCommonModule, PlatformHttpService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { FieldType, getMultiStepDialogDataToken, UiCommonLookupDataFactoryService, UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { differenceInDays, differenceInMonths, differenceInQuarters, differenceInWeeks } from 'date-fns';
import { IGenerateDeliveryScheduleDataComplete, IGenerateDeliverySchedulePrepareSpecifyDetails } from '../../../model/interfaces/wizard/prc-common-generate-delivery-schedule-wizard.interface';
import { DeliveryScheduleRepeatOptions } from '../../../model/enums/procurement-delivery-schedule-select.enum';

@Component({
	selector: 'procurement-common-generate-delivery-specify-schedule-details',
	standalone: true,
	templateUrl: './delivery-schedule-specify-schedule-details.component.html',
	styleUrls: ['./delivery-schedule-specify-schedule-details.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule, CommonModule],
})
export class ProcurementCommonGenerateDeliveryScheduleSpecifyScheduleDetailsComponent {
	@Input()
	protected optionItem!: IGenerateDeliverySchedulePrepareSpecifyDetails;
	protected readonly http = inject(PlatformHttpService);
	protected validationMessage = 'validation error here';
	protected readonly repeatLookupService = inject(UiCommonLookupDataFactoryService).fromItems(
		[
			{
				id: DeliveryScheduleRepeatOptions.weekly,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.weekly',
				},
			},
			{
				id: DeliveryScheduleRepeatOptions.monthly,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.monthly',
				},
			},
			{
				id: DeliveryScheduleRepeatOptions.quarterly,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.quarterly',
				},
			},
			{
				id: DeliveryScheduleRepeatOptions.userSpecified,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.userSpecified',
				},
			},
		],
		{
			uuid: 'cdbb3af1db994eb283acc2c39b4bfa92',
			valueMember: 'id',
			displayMember: 'desc',
			translateDisplayMember: true,
		},
	);
	protected readonly FieldType = FieldType;
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IGenerateDeliveryScheduleDataComplete>());
	protected readonly multipleOptions = this.dialogData.dataItem.multipleOptions;

	protected valueChangedRepeat(newValue: PropertyType) {
		this.optionItem.RepeatOptionId = newValue as number;
		this.updateOccurrence();
	}

	protected valueChangedStartDate(newValue: PropertyType) {
		this.updateOccurrence();
	}

	protected valueChangedEndDate(newValue: PropertyType) {
		this.updateOccurrence();
	}

	protected hasError() {
		if (this.optionItem.EndDate && this.optionItem.StartDate) {
			const diffDays = differenceInDays(this.optionItem.EndDate, this.optionItem.StartDate);
			if (this.optionItem.RepeatOptionId === DeliveryScheduleRepeatOptions.userSpecified && diffDays < (this.optionItem?.Occurrence || 0)) {
				this.validationMessage = this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyOccurrenceByError').text;
				this.optionItem.HasError = true;
			}
			this.validationMessage = this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyTimeByError').text;
			this.optionItem.HasError = diffDays <= 0;
		}
		return this.optionItem.HasError;
	}

	protected async safetyLeadTimeCheckboxChanged() {
		const maxSafetyLeadTime = this.dialogData.dataItem.prepareItems.prcItems.reduce((prevMax, item) => Math.max(prevMax, item.SafetyLeadTime), 0);
		if (!this.optionItem.UseTempSafetyLeadTimeAction) {
			this.optionItem.UseTempSafetyLeadTime = maxSafetyLeadTime;
			await this.safetyLeadTimeOptionChanged();
		}
	}

	protected async safetyLeadTimeOptionChanged() {
		const prepareItems = this.dialogData.dataItem.prepareItems.optionItem;
		const prepareItemScope = this.dialogData.dataItem.prepareItemScope.optionItem;
		if (prepareItems.LinkedEstLineItem) {
			const minStartDateTimestamp = this.dialogData.dataItem.prepareItems.prcItems.reduce((prevMinTimestamp, item) => {
				const itemTimestamp = item?.MinStartDate ? item.MinStartDate.getTime() : Infinity;
				return Math.min(prevMinTimestamp, itemTimestamp);
			}, Infinity);
			const maxFinishDateTimestamp = this.dialogData.dataItem.prepareItems.prcItems.reduce((prevMaxTimestamp, item) => {
				const itemTimestamp = item?.MaxFinishDate ? item.MaxFinishDate.getTime() : Infinity;
				return Math.max(prevMaxTimestamp, itemTimestamp);
			}, Infinity);

			const minStartDate = new Date(minStartDateTimestamp);
			const maxFinishDate = new Date(maxFinishDateTimestamp);

			this.optionItem.StartDate = this.subtractDaysFromDate(minStartDate, this.optionItem.UseTempSafetyLeadTime || 0);
			this.optionItem.EndDate = this.subtractDaysFromDate(maxFinishDate, this.optionItem.UseTempSafetyLeadTime || 0);
			this.optionItem.StartDateAction = this.optionItem.EndDateAction = true;
			this.updateOccurrence();
		} else if (prepareItems.LinkedActivity && prepareItemScope.ActivityFk) {
			const response = await this.http.get<{ CurrentStart: Date; CurrentFinish: Date }>('scheduling/main/activity/get', { params: { mainItemId: prepareItemScope.ActivityFk } });
			if (response) {
				this.optionItem.StartDate = this.subtractDaysFromDate(response.CurrentStart, this.optionItem.UseTempSafetyLeadTime || 0);
				this.optionItem.EndDate = this.subtractDaysFromDate(response.CurrentFinish, this.optionItem.UseTempSafetyLeadTime || 0);
				this.optionItem.StartDateAction = this.optionItem.EndDateAction = true;
				this.updateOccurrence();
			}
		}
	}

	protected occurrenceReadOnly = () => this.optionItem.RepeatOptionId !== DeliveryScheduleRepeatOptions.userSpecified;

	private calculateDateDifference(endDate: Date, startDate: Date): number {
		switch (this.optionItem.RepeatOptionId) {
			case DeliveryScheduleRepeatOptions.weekly:
				return differenceInWeeks(endDate, startDate);
			case DeliveryScheduleRepeatOptions.monthly:
				return differenceInMonths(endDate, startDate);
			case DeliveryScheduleRepeatOptions.quarterly:
				return differenceInQuarters(endDate, startDate);
			default:
				return 0;
		}
	}

	private updateOccurrence() {
		if (this.optionItem.StartDate && this.optionItem.EndDate) {
			this.optionItem.Occurrence = this.calculateDateDifference(this.optionItem.EndDate, this.optionItem.StartDate) + 1;
		} else {
			this.optionItem.Occurrence = 0;
		}
	}

	private subtractDaysFromDate(date: Date, daysToSubtract: number): Date {
		const dateInMilliseconds = date.getTime();
		const daysInMilliseconds = daysToSubtract * 24 * 60 * 60 * 1000;
		return new Date(dateInMilliseconds - daysInMilliseconds);
	}
}
