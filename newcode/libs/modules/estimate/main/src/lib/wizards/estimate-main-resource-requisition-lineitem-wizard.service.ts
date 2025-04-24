/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, FormStep, IFormConfig, MultistepDialog, UiCommonFormDialogService, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IReqRequisition, IStep1, IStep2, IStep3 } from '../model/interfaces/estimate-main-resource-requisition-lineitem.interface';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';

@Injectable({ providedIn: 'root' })

/**
 *  EstimateMainResourceRequisitionLineitemWizardService
 *  This services for Create resource requisition of line item in estimate.
 */
export class EstimateMainResourceRequisitionLineitemWizardService {
	private http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly wizardDialogService = inject(UiCommonMultistepDialogService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly estimateContextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

	private step1: IFormConfig<IStep1> = {
		formId: 'step1',
		showGrouping: false,
		rows: [
			{
				id: 'Selection',
				label: {
					text: 'Create Requisition From',
				},
				type: FieldType.Radio,
				model: 'Selection',
				sortOrder: 1,
				required: true,
				itemsSource: {
					items: [
						{
							id: 'fullEstimate',
							displayName: { key: 'estimate.main.createResRequisitionFromLineItemsWizard.fullEstimate' },
						},
						{
							id: 'lineItems',
							displayName: { key: 'estimate.main.createResRequisitionFromLineItemsWizard.lineItems' },
						},
					],
				},
			},
		],
	};

	private step2: IFormConfig<IStep2> = {
		formId: 'step2',
		showGrouping: false,
		rows: [
			{
				id: 'ProcessCostCodes',
				type: FieldType.Boolean,
				model: 'ProcessData.ProcessCostCodes',
				sortOrder: 1,
				required: true,
				label: {
					text: 'Process Cost Codes to Resource Type',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.processCostCodes',
				},
				visible: true
			},
			{
				id: 'ProcessMaterial',
				type: FieldType.Boolean,
				model: 'ProcessData.ProcessMaterial',
				sortOrder: 2,
				required: true,
				label: {
					text: 'Process Material',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.processMaterial',
				},
				visible: true
			},
			{
				id: 'ProcessPlant',
				type: FieldType.Boolean,
				model: 'ProcessData.ProcessPlant',
				sortOrder: 3,
				required: true,
				label: {
					text: 'Process Plant To Resource',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.processPlant',
				},
				visible: true
			},
			{
				id: 'ProcessResResource',
				type: FieldType.Boolean,
				model: 'ProcessData.ProcessResResource',
				sortOrder: 4,
				required: true,
				label: {
					text: 'Process Resources',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.processResResource',
				},
				visible: true
			}
		]
	};

	private step3: IFormConfig<IStep3> = {
		formId: 'step3',
		showGrouping: false,
		rows: [
			{
				id: 'ControllingUnit',
				type: FieldType.Boolean,
				model: 'Aggression.ControllingUnit',
				sortOrder: 1,
				required: true,
				label: {
					text: 'Controlling Unit',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.controllingUnit'
				},
				visible: true
			},
			{
				id: 'ProcurementStructure',
				type: FieldType.Boolean,
				model: 'Aggression.ProcurementStructure',
				sortOrder: 2,
				required: true,
				label: {
					text: 'Controlling Unit',
					key: 'estimate.main.createResRequisitionFromLineItemsWizard.procurementStructure'
				},
				visible: true
			},
		],
	};

	private formData: IReqRequisition = {
		Step1: {
			Selection: '',
		},
		Step2: {
			ProcessData: {
				ProcessCostCodes: false,
				ProcessMaterial: false,
				ProcessPlant: false,
				ProcessResResource: false
			}
		},
		Step3: {
			Aggression: {
				ControllingUnit: false,
				ProcurementStructure: false
			},
		},
	};

	/**
	 * Create requisition for line item
	 */
	public async createResRequisitionFromLineItems() {
		const stepForm1 = new FormStep('step1', this.translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.step1Title'), this.step1, 'Step1');
		const stepForm2 = new FormStep('step2', this.translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.step2Title'), this.step2, 'Step2');
		const stepForm3 = new FormStep('step3', this.translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.step3Title'), this.step3, 'Step3');

		const multistepDialog = new MultistepDialog(this.formData, [stepForm1, stepForm2, stepForm3], this.translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.title'));
		const btns = multistepDialog.dialogOptions?.buttons;
		if (btns) {
			btns[1] = {
				id: 'next',
				caption: { text: 'Next' },
				isDisabled: (info) => {
					if (info.dialog.value?.stepIndex === 0) {
						return !info.dialog.value?.dataItem?.Step1.Selection;
					}

					if (info.dialog.value?.stepIndex === 1) {
						return true;
					}

					return true;
				},
			};

			btns[2] = {
				id: 'Ok',
				caption: { text: 'Finish' },
				isDisabled: (info) => {
					return !(info.dialog.value?.stepIndex === 2);
				},
				fn: () => {
					this.onFinish();
					this.resetFormData();
				},
				autoClose: true,
			};
		}

		await this.wizardDialogService.showDialog(multistepDialog);
	}

	private onFinish() {
		// type Action = {
		// 	Action: number;
		// 	EstimateId: number;
		// 	LineItemIds: number[] | null | undefined;
		// 	IsFullEstimate: boolean;
		// 	IsSelectedLineItems: boolean;
		// 	CreateRequisitionByCostCode: boolean;
		// 	CreateRequisitionByMaterial: boolean;
		// 	CreateRequisitionByPlant: boolean;
		// 	CreateRequisitionByResResource: boolean;
		// 	GroupByControllingUnit: boolean;
		// 	GroupByPrcStructure: boolean;
		// };

		// const actions: Action = {
		// 	Action: 18,
		// 	EstimateId: this.estimateContextService.getSelectedEstHeaderId() !== null ? this.estimateContextService.getSelectedEstHeaderId() : 0,                  // TODO  need activitycomplete iteface from schedulling 
		// 	if (response.Valid && !response.ValidationError) {
		// 	LineItemIds: this.estimateMainService.getSelection().length > 0 ? this.getSelectedIds() : [],
		// 	IsFullEstimate: this.formData.Step1.Selection === 'fullEstimate',
		// 	IsSelectedLineItems: this.formData.Step1.Selection === 'lineItems',
		// 	CreateRequisitionByCostCode: this.formData.Step2.ProcessData.ProcessCostCodes !== null ? this.formData.Step2.ProcessData.ProcessCostCodes : false,
		// 	CreateRequisitionByMaterial: this.formData.Step2.ProcessData.ProcessMaterial !== null ? this.formData.Step2.ProcessData.ProcessMaterial : false,
		// 	CreateRequisitionByPlant: this.formData.Step2.ProcessData.ProcessPlant !== null ? this.formData.Step2.ProcessData.ProcessPlant : false,
		// 	CreateRequisitionByResResource: this.formData.Step2.ProcessData.ProcessResResource !== null ? this.formData.Step2.ProcessData.ProcessResResource : false,
		// 	GroupByControllingUnit: this.formData.Step3.Aggression.ControllingUnit !== null ? this.formData.Step3.Aggression.ControllingUnit : false,
		// 	GroupByPrcStructure: this.formData.Step3.Aggression.ProcurementStructure !== null ? this.formData.Step3.Aggression.ProcurementStructure : false
		// };

		// this.http.post<ActivityComplete>(this.configService.webApiBaseUrl + 'scheduling/main/activity/execute', actions).subscribe((response: ActivityComplete) => {     
		// 		this.messageBoxService.showMsgBox('estimate.main.createResRequisitionFromLineItemsWizard.creationSuccess', 'estimate.main.createResRequisitionFromLineItemsWizard.title', 'ico-info', 'message', false);
		// 	} else {
		// 		if (response.ValidationError) {
		// 			this.messageBoxService.showMsgBox('estimate.main.createResRequisitionFromLineItemsWizard.error', 'estimate.main.createResRequisitionFromLineItemsWizard.title', 'error');
		// 		} else {
		// 			this.messageBoxService.showMsgBox('estimate.main.createResRequisitionFromLineItemsWizard.warning', 'estimate.main.createResRequisitionFromLineItemsWizard.title', 'warning');
		// 		}
		// 	}
		// });
	}

	private getSelectedIds(): number[] {
		return this.estimateMainService
			.getSelection()
			.filter(this.isValidId)
			.map((item) => item.Id as number);
	}
	private isValidId(item: IEstLineItemEntity): boolean {
		return typeof item.Id === 'number' && !isNaN(item.Id);
	}
		
	private resetFormData() {
		this.formData = {
			Step1: {
				Selection: '',
			},
			Step2: {
				ProcessData: {
					ProcessCostCodes: false,
					ProcessMaterial: false,
					ProcessPlant: false,
					ProcessResResource: false
				},
			},
			Step3: {
				Aggression: {
					ControllingUnit: false,
					ProcurementStructure: false
				},
			},
		};
	}
}
