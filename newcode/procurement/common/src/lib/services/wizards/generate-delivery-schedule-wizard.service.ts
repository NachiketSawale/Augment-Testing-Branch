/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { CustomStep, MultistepDialog, MultistepTitleFormat, UiCommonMultistepDialogService } from '@libs/ui/common';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { IGenerateDeliveryScheduleDataComplete, IGenerateDeliveryScheduleWarningResult, IPrcItemEntitySelectable } from '../../model/interfaces/wizard/prc-common-generate-delivery-schedule-wizard.interface';
import { ProcurementCommonItemDataService } from '../procurement-common-item-data.service';
import { IPrcItemEntity } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { inject } from '@angular/core';
import { DataServiceFlatNode } from '@libs/platform/data-access';
import { ProcurementCommonGenerateDeliveryScheduleChooseItemScopeComponent } from '../../components/generate-delivery-schedule/step1-choose-item-scope/delivery-schedule-choose-item-scope.component';
import { ProcurementCommonGenerateDeliveryScheduleChooseItemsComponent } from '../../components/generate-delivery-schedule/step2-choose-items/delivery-schedule-choose-items.component';
import { ProcurementCommonGenerateDeliveryScheduleSpecifyScheduleDetailsComponent } from '../../components/generate-delivery-schedule/step3-specify-schedule-details/delivery-schedule-specify-schedule-details.component';
import { ProcurementCommonGenerateDeliveryScheduleShowResultItemsComponent } from '../../components/generate-delivery-schedule/step4-show-result-items/delivery-schedule-show-result-items.component';
import { DeliveryScheduleRadioSelect, DeliveryScheduleRepeatOptions, DeliveryScheduleSourceStatus, DeliveryScheduleStepSelect } from '../../model/enums';
import { ICommonWizard } from '../../model/interfaces/wizard/common-wizard.interface';

interface IProcurementCommonGenerateDeliveryScheduleWizardConfig<
	T extends IEntityIdentification,
	U extends CompleteIdentification<T>,
	IT extends IPrcItemEntity,
	IU extends PrcCommonItemComplete,
	PT extends object,
	PU extends CompleteIdentification<PT>,
> extends IProcurementCommonWizardConfig<T, U> {
	getInitStartDate: (entity: T) => Date | undefined;
	prcItemService?: ProcurementCommonItemDataService<IT, IU, T, U>;
	//package
	multipleOptions?: boolean;
	subDataService?: DataServiceFlatNode<PT, PU, T, U>;
	getActivityFk?: (entity: T) => number | undefined;
	getSubPrcHeaderFk?: (subEntity?: PT) => number | undefined;
}

export class ProcurementCommonGenerateDeliveryScheduleWizardService<
		T extends IEntityIdentification,
		U extends CompleteIdentification<T>,
		IT extends IPrcItemEntity,
		IU extends PrcCommonItemComplete,
		PT extends object,
		PU extends CompleteIdentification<PT>,
	>
	extends ProcurementCommonWizardBaseService<T, U, IGenerateDeliveryScheduleDataComplete>
	implements ICommonWizard {
	private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);

	public constructor(protected override readonly config: IProcurementCommonGenerateDeliveryScheduleWizardConfig<T, U, IT, IU, PT, PU>) {
		super(config);
	}

	protected override async showWizardDialog() {
		const selHeader = this.config.rootDataService.getSelectedEntity()!;
		const subHeader = this.config.subDataService?.getSelectedEntity() ?? ([] as PT);
		const stepTitle = this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.wizard');
		const chooseItemScope = new CustomStep('chooseItemScope', stepTitle, ProcurementCommonGenerateDeliveryScheduleChooseItemScopeComponent, [], 'prepareItemScope');
		const chooseItems = new CustomStep('chooseItems', stepTitle, ProcurementCommonGenerateDeliveryScheduleChooseItemsComponent, [], 'prepareItems');
		const specifySchedule = new CustomStep('specifySchedule', stepTitle, ProcurementCommonGenerateDeliveryScheduleSpecifyScheduleDetailsComponent, [], 'prepareSpecifyDetails');
		const showResult = new CustomStep('showResult', stepTitle, ProcurementCommonGenerateDeliveryScheduleShowResultItemsComponent, [], 'prepareResultItems');

		const pcHeaderFk = this.config.getSubPrcHeaderFk?.(subHeader);
		const activityFk = this.config.getActivityFk?.(selHeader);
		const prcItems = (this.config.prcItemService?.getList() ?? []).map((item) => ({ ...item, isSelected: true }));
		const startDate = this.config.getInitStartDate(selHeader);
		const dataItem: IGenerateDeliveryScheduleDataComplete = {
			multipleOptions: this.multipleOptions,
			prepareItemScope: {
				optionItem: {
					BasicOption: pcHeaderFk ? DeliveryScheduleRadioSelect.CurrentSubPackage : DeliveryScheduleRadioSelect.CurrentAllSubPackages,
					PackageId: selHeader.Id,
					PrcHeaderId: pcHeaderFk,
					ActivityFk: activityFk,
				},
			},
			prepareItems: {
				optionItem: {
					LinkedEstLineItem: false,
					LinkedActivity: false,
					LinkedEstLineItemAction: false,
					HasActivity: !!activityFk,
					LinkedActivityAction: !activityFk,
					SelectIds: [],
				},
				prcItems: prcItems,
			},
			prepareSpecifyDetails: {
				optionItem: {
					DescriptionPrefix: '',
					RepeatOptionId: DeliveryScheduleRepeatOptions.weekly,
					StartDate: startDate,
					EndDate: undefined,
					Occurrence: 0,
					RoundUpQuantity: false,
					UseTempSafetyLeadTime: undefined,
					OccurrenceAction: false,
					UseTempSafetyLeadTimeAction: false,
					StartDateAction: false,
					EndDateAction: false,
					HasError: false,
				},
			},
			prepareResultItems: {
				isSuccess: false,
				warningItems: [],
			},
		};

		const multistepDialog = new MultistepDialog(dataItem, this.multipleOptions ? [chooseItemScope, chooseItems, specifySchedule, showResult] : [chooseItems, specifySchedule, showResult]);
		multistepDialog.titleFormat = MultistepTitleFormat.MainTitleProgressStepTitle;
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'previousStep',
				caption: { key: 'cloud.common.previousStep' },
				isVisible: (info) => {
					return this.isCurrentStep([DeliveryScheduleStepSelect.ChooseItems, DeliveryScheduleStepSelect.SpecifySchedule], multistepDialog);
				},
				fn: (event, info) => {
					info.dialog.value?.goToPrevious();
				},
			},
			{
				id: 'nextBtn',
				caption: { key: 'basics.common.button.nextStep' },
				isVisible: (info) => {
					return this.isCurrentStep([DeliveryScheduleStepSelect.ChooseItemScope, DeliveryScheduleStepSelect.ChooseItems], multistepDialog);
				},
				isDisabled: (info) => {
					if (this.getStepIndex(info.dialog.value) === DeliveryScheduleStepSelect.ChooseItems) {
						if (info.dialog.value?.dataItem) {
							//The grid checkBox is invalid
							const selectItems = info.dialog.value.dataItem.prepareItems.prcItems.filter((item) => item.isSelected && item.Quantity > 0);
							if (selectItems.length > 0) {
								dataItem.prepareItems.optionItem.SelectIds = selectItems.map((item) => item.Id);
								return false;
							}
						}
						return true;
					}
					return false;
				},
				fn: async (event, info) => {
					info.dialog.value?.goToNext();
					if (info.dialog.value) {
						await this.clickNext(info.dialog.value);
					}
				},
			},
			{
				id: 'execute',
				caption: { key: 'basics.common.button.execute' },
				isVisible: (info) => {
					return this.isCurrentStep([DeliveryScheduleStepSelect.SpecifySchedule], multistepDialog);
				},
				isDisabled: (info) => {
					return info.dialog.value ? this.isExecuteDisabled(info.dialog.value) : false;
				},
				fn: (event, info) => {
					if (info.dialog.value) {
						info.dialog.value?.goToNext();
						this.goToSave(info.dialog.value, false);
					}
				},
			},
			{
				id: 'okBtn',
				isVisible: (info) => {
					return this.isCurrentStep([DeliveryScheduleStepSelect.ShowResult], multistepDialog);
				},
				caption: { key: 'basics.common.button.ok' },
				autoClose: true,
			},
			{
				id: 'closeWin',
				isVisible: (info) => {
					return !this.isCurrentStep([DeliveryScheduleStepSelect.ShowResult], multistepDialog);
				},
				caption: { key: 'basics.common.button.cancel' },
				autoClose: true,
			},
		];
		multistepDialog.dialogOptions.width = this.multipleOptions ? '1000px' : '800px';
		return this.multistepService.showDialog(multistepDialog);
	}

	private isCurrentStep(steps: DeliveryScheduleStepSelect[], dialog: MultistepDialog<IGenerateDeliveryScheduleDataComplete>): boolean {
		return steps.map((value) => value).includes(this.getStepIndex(dialog));
	}

	private get multipleOptions() {
		return this.config.multipleOptions ?? false;
	}

	private async clickNext(dialog: MultistepDialog<IGenerateDeliveryScheduleDataComplete>) {
		if (!dialog || dialog.stepIndex !== DeliveryScheduleStepSelect.ChooseItemScope) {
			return;
		}

		const optionItem = dialog.dataItem.prepareItemScope.optionItem;
		const selectItems = await this.http.post<IPrcItemEntitySelectable[]>('procurement/common/deliveryschedule/getsource', optionItem);

		if (selectItems.length === 0) {
			dialog.dataItem.prepareItems.optionItem.LinkedEstLineItemAction = true;
			dialog.dataItem.prepareItems.optionItem.LinkedActivityAction = true;
		} else {
			const hasAllEstLinkedWithSCHD = selectItems.every((item) => item.SourceStatus === DeliveryScheduleSourceStatus.EstLinkedWithSCHD);
			dialog.dataItem.prepareItems.optionItem.LinkedEstLineItemAction = !hasAllEstLinkedWithSCHD;
			dialog.dataItem.prepareItems.prcItems = selectItems.map((item) => ({ ...item, isSelected: true }));
		}
	}

	private isExecuteDisabled(dialog: MultistepDialog<IGenerateDeliveryScheduleDataComplete>) {
		const prepareItems = dialog.dataItem.prepareItems.optionItem;
		const prepareSpecifyDetails = dialog.dataItem.prepareSpecifyDetails.optionItem;
		let canToOk: boolean;
		if (prepareItems.LinkedEstLineItem) {
			canToOk =
				!prepareSpecifyDetails.HasError &&
				prepareItems.SelectIds.length > 0 &&
				(prepareSpecifyDetails.RepeatOptionId !== DeliveryScheduleRepeatOptions.userSpecified || (prepareSpecifyDetails.RepeatOptionId === DeliveryScheduleRepeatOptions.userSpecified && (prepareSpecifyDetails.Occurrence || 0) > 0));
		} else {
			canToOk = !prepareSpecifyDetails.HasError && prepareItems.SelectIds.length > 0 && prepareSpecifyDetails.StartDate !== undefined && prepareSpecifyDetails.EndDate !== undefined && (prepareSpecifyDetails.Occurrence || 0) > 0;
		}
		return !canToOk;
	}

	private async goToSave(dialog: MultistepDialog<IGenerateDeliveryScheduleDataComplete>, isContinue: boolean) {
		const prepareItems = dialog.dataItem.prepareItems.optionItem;
		const prepareSpecifyDetails = dialog.dataItem.prepareSpecifyDetails.optionItem;
		const parameter = {
			LinkedActivity: prepareItems.LinkedActivity,
			LinkedEstLineItem: prepareItems.LinkedEstLineItem,
			DescriptionPrefix: prepareSpecifyDetails.DescriptionPrefix,
			Repeat: prepareSpecifyDetails.RepeatOptionId,
			//Server side only accept the date local time. Maybe need to change the server side to accept the UTC time.
			StartDate: prepareSpecifyDetails.StartDate?.toLocaleString(),
			EndDate: prepareSpecifyDetails.EndDate?.toLocaleString(),
			Occurence: prepareSpecifyDetails.Occurrence,
			TimeRequired: prepareSpecifyDetails.TimeRequired,
			SelectIds: prepareItems.SelectIds,
			IsContinue: isContinue,
			RoundUpQuantity: prepareSpecifyDetails.RoundUpQuantity,
		};
		const response = await this.http.post<IGenerateDeliveryScheduleWarningResult[]>('procurement/common/deliveryschedule/save', parameter);
		if (response.length === 0) {
			dialog.dataItem.prepareResultItems.isSuccess = true;
		} else {
			dialog.dataItem.prepareResultItems.warningItems = response;
			dialog.dataItem.prepareResultItems.isSuccess = false;
		}
	}

	private getStepIndex(dialog: MultistepDialog<IGenerateDeliveryScheduleDataComplete> | undefined) {
		return dialog ? (this.multipleOptions ? dialog.stepIndex : dialog.stepIndex + 1) : -1;
	}

	public execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}
