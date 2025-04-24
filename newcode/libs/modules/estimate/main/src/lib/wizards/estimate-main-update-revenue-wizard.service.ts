/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IEstimateUpdateRevenue } from '../model/interfaces/estimate-main-update-revenue.interface';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


@Injectable({ providedIn: 'root' })

/**
 *
 * This service provides functionality for updating revenue in the main estimate.
 */
export class EstimateMainUpdateRevenueWizardService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
    private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	/**
	 * This method displays a form dialog for updating revenue in the main estimate
	 * and handles the result accordingly.
	 *
	 */
	public async updateRevenue() {
		const result = await this.formDialogService
			.showDialog<IEstimateUpdateRevenue>({
				id: 'AssemblyCategoryId',
				headerText: { key: 'estimate.main.updateRevenue' },
				formConfiguration: this.convertLineItemformConfiguration,
				entity: this.data,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOK(result);

				}
			});

		return result;
	}

	/**
	 * Form configuration data.
	 */
	private convertLineItemformConfiguration: IFormConfig<IEstimateUpdateRevenue> = {
		formId: 'estimate.main.convertLineItemToAssemblyDialog',
		showGrouping: false,
		rows: [
			{
				id: 'SelectedItem',
				label: {
					key: 'estimate.main.updateRevenue',
				},
				type: FieldType.Radio,
				model: 'selectedLevel',
				required: true,
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: { key: 'estimate.main.allLineItems' },
						},
						{
							id: 2,
							displayName: { key: 'estimate.main.slectedLineItemsUpdRevenue' },
						},
					],
				},
			},
			{
				id: 'DistributeBy',
				label: {
					key: 'estimate.main.distributeBy',
				},
				type: FieldType.Radio,
				model: 'DistributeBy',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: { key: 'estimate.main.cost' },
						},
						{
							id: 2,
							displayName: { key: 'estimate.main.budget' },
						},
					],
				},
			},
		],
	};

	private data: IEstimateUpdateRevenue = {
		selectedLevel:'',
		DistributeBy: 0
	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOK(result: IEditorDialogResult<IEstimateUpdateRevenue>) {
		if (result) {
			if (result.value) {
				this.updateEstimateRevenue(result.value);
			}
		}
	}

	/**
	 * Updates the estimated revenue for the main service.
	 * This method sends a POST request to update the revenue via HTTP.
	 */
	private updateEstimateRevenue(result: IEstimateUpdateRevenue) {
    const data = {
        EstHeaderId: this.estimateMainContextService.selectedEstHeaderFk,
        ProjectId: this.estimateMainContextService.getSelectedProjectId(),
        SelectedItemId: this.estimateMainService.getIfSelectedIdElse(0),
        IsDistributeByCost: result.DistributeBy,
        IsUpdateByWipQuantity: result.IsUpdateByWipQuantity,
		EstLineItems: result.selectedLevel ? this.estimateMainService.getSelectedEntity() : []
    };

    this.http.post<IEstLineItemEntity[]>(`${this.configService.webApiBaseUrl}estimate/main/wizard/updaterevenue`, data)
        .subscribe((response: IEstLineItemEntity[]) => {
            const lineItems = response && response.length ? response : null;
            if (!lineItems) {
                return;
            }
            this.estimateMainService.addList(lineItems);
            const list = this.estimateMainService.getList();
            const selected = list.find(item => item.Id === data.SelectedItemId);
            if (selected) {
                this.estimateMainService.setModified(selected);
            }
            this.messageBoxService.showMsgBox('cloud.common.doneSuccessfully', 'estimate.main.updateRevenue', 'info');
        });

    if (result.selectedLevel && this.estimateMainService.getSelectedEntity()) {
        this.estimateMainService.updateAndExecute(() => this.updateEstimateRevenue(this.data));
    }
}

}
