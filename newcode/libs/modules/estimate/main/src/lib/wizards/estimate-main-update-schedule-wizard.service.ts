/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';

interface IEstimateUpdateQtyInScheduling {
	UpdateQuantities: boolean;
	UpdateHours: boolean;
	UpdateSummaryActivities: boolean;
}

@Injectable({ providedIn: 'root' })

/**
 *  This services for provides functionality for the wizard update quantities in schedule.
 */
export class EstimateMainUpdateScheduleWizardService {
	private http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private lineItemTransferMessage: string = 'estimate.main.updateQuantitiesInSchedulingWizard.actQtyRelationNotSetToStructure';
	private entity: IEstimateUpdateQtyInScheduling = {
		UpdateQuantities: true,
		UpdateHours: false,
		UpdateSummaryActivities: false,
	};

	/**
	 * Displays a wizard dialog.
	 */
	public async updateActivitiesQuantity() {
		const result = this.formDialogService
			.showDialog<IEstimateUpdateQtyInScheduling>({
				id: 'updateQuantitiesInScheduling',
				headerText: 'estimate.main.updateQuantitiesInSchedulingWizard.updateQuantitiesInScheduling',
				formConfiguration: this.formConfiguration,
				entity: this.entity,
				runtime: undefined,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});

		return result;
	}

	/**
	 * Form configuration data.
	 */
	private formConfiguration: IFormConfig<IEstimateUpdateQtyInScheduling> = {
		formId: 'estimate.main.updateBaseCost',
		showGrouping: false,
		rows: [
			{
				id: 'updateQty',
				label: {
					key: 'estimate.main.updateQuantitiesInSchedulingWizard.updateQuantity',
				},
				type: FieldType.Boolean,
				model: 'UpdateQuantities',
				sortOrder: 1
			},
			{
				id: 'updateHours',
				label: {
					key: 'estimate.main.updateQuantitiesInSchedulingWizard.updateHours',
				},
				type: FieldType.Boolean,
				model: 'UpdateHours',
				sortOrder: 2,
			},
			{
				id: 'updateSummaryActivities',
				label: {
					key: 'estimate.main.updateQuantitiesInSchedulingWizard.updateSummaryActivities',
				},
				type: FieldType.Boolean,
				model: 'UpdateSummaryActivities',
				sortOrder: 3
			},
		],
	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IEstimateUpdateQtyInScheduling>): void {
		// const lineItems = this.estimateMainService.getListOfLineItemsWhichTransferDataToActivity().map(e=>e.Id);
		// const lineItemHeader = this.estimateMainContextService.getSelectedEstHeaderId();
		const lineItemsNotToStructure = this.estimateMainService.getListOfLineItemsWhichTransferDataNotToActivity();
		if (lineItemsNotToStructure.length > 0) {
			lineItemsNotToStructure.forEach((li) => {
				this.lineItemTransferMessage = this.lineItemTransferMessage + li.Code + '\t' + li.DescriptionInfo?.Translated + '<br>';
			});
		} else {
			this.lineItemTransferMessage = '';
		}

		if (!result || !result.value) {
			return;
		}

		// type EstimateUpdateQtyInScheduling = {
		// 	Action: 16;
		// 	LineItemIds: number[];
		// 	LineItemHeader: number;
		// 	UpdateActivityQuantity: boolean;
		// 	UpdateActivityDuration: boolean;                                                        // TDODO : need activitycomplete interface from schedulling 
		// 	UpdateSummaryActivities: boolean;
		// };

		// const action: EstimateUpdateQtyInScheduling = {
		// 	Action: 16,
		// 	LineItemIds: lineItems,
		// 	LineItemHeader: lineItemHeader,
		// 	UpdateActivityQuantity: result.value.UpdateQuantities,
		// 	UpdateActivityDuration: result.value.UpdateHours,
		// 	UpdateSummaryActivities: result.value.UpdateSummaryActivities,
		// };

		// this.http.post<ActivityComplete>(`${this.configService.webApiBaseUrl}scheduling/main/activity/execute`, action).subscribe((response:ActivityComplete) => {
		// 	if (response.LineItemsWhichNotTransferredQuantity && response.LineItemsWhichNotTransferredQuantity.length > 0) {
		// 		this.lineItemTransferMessage = this.lineItemTransferMessage + 'estimate.main.updateQuantitiesInSchedulingWizard.noQuantityTransferredForWrongUoM';
		// 		response.LineItemsWhichNotTransferredQuantity.forEach(li => {
		// 			const description = li.DescriptionInfo?.Translated ?? '';
		// 			this.lineItemTransferMessage = this.lineItemTransferMessage + li.Code + '\t' + description + '<br>';
		// 		});
		// 	} else {
		// 		this.lineItemTransferMessage = '';
		// 	}
		// 	if (!this.lineItemTransferMessage) {
		// 		this.lineItemTransferMessage = 'cloud.common.doneSuccessfully';
		// 	}
		// 	this.messageBoxService.showMsgBox(this.lineItemTransferMessage, 'estimate.main.updateQuantitiesInSchedulingWizard.transferOfLineItemQuantityToActivitySuccessful', 'ico-info', '', false);
		// });
	}
}
