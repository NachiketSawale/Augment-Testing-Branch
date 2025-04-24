/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { Observable, map } from 'rxjs';
import { IEstimateLineItemUpdateQuantity, IEstimateUpdateQuantityPostData } from '../model/interfaces/estimate-main-update-line-item-quantity.interface';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


@Injectable({
	providedIn: 'root'
})
export class EstimateMainUpdateLineItemQuantityWizardService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly title = 'estimate.main.wizardDialog.updateLineItemQuantityWizardTitle';
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMaincontextService = inject(EstimateMainContextService);

	private entity: IEstimateLineItemUpdateQuantity = {
		EstimateScope: 'EntireEstimate',
		SelectedItem: 'IsSchedule',
		UpdatePlannedQuantity: '',
		UpdatePlannedQuantityConsiderScurve: false,
		UpdateBillingQuantity: '',
		HintText: '',
		IsCompletePerformance: true,
		IsUpdateFQ: true,
		EstHeaderFk: 0,
		LineItems: [],
		ProjectId: 0,
		SelectedLineItem: null
	};


	/**
	 * Update line item quantity wizard
	 */
	public async updateLineItemQuantity() {
		const selectedLineItem = this.estimateMainService.getSelectedEntity();
		const selectedPrjId = this.estimateMaincontextService.getProjectId() || (selectedLineItem ? selectedLineItem?.ProjectFk : 0);
		const projectId = selectedPrjId ?? -1;
		
		this.getProject(projectId).subscribe((projectItem: IProjectEntity) => {
			this.entity.IsCompletePerformance = projectItem && projectItem.IsCompletePerformance;
			this.entity.HintText = projectItem && projectItem.IsCompletePerformance ? 'estimate.main.wizardDialog.completePerformanceActiveText' : 'estimate.main.wizardDialog.completePerformanceInActiveText';
		});		

		const result = await this.formDialogService
			.showDialog<IEstimateLineItemUpdateQuantity>({
				id: '',
				headerText: { key: this.title },
				formConfiguration: this.configurationData,
				entity: this.entity,
				runtime: undefined,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOK(result);
				}
			});

		return result;
	}

	/**
	 * Get Project data
	 */

	private getProject(id: number): Observable<IProjectEntity> {
		return this.http.get<IProjectEntity>(`${this.configService.webApiBaseUrl}project/main/byid?id=${id}`).pipe(
			map((response: IProjectEntity) => {
				return response;
			}),
		);
	}

	/**
	 * Form configuration data.
	 */
	private configurationData: IFormConfig<IEstimateLineItemUpdateQuantity> = {
		formId: this.title,
		showGrouping: false,
		rows: [
			{
				id: 'estimateScope',
				label: {
					key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
				},
				type: FieldType.Radio,
				model: 'estimateScope',
				itemsSource: {
					items: [
						{
							id: 'EntireEstimate',
							displayName: 'estimate.main.splitLineItemWizard.entireEstimate',
						},
						{
							id: 'SelectedLineItems',
							displayName: 'estimate.main.slectedLineItems'
						}
					]
				}
			},
			{
				id: 'updatePlannedQuantityConsiderScurve',
				label: {
					key: 'estimate.main.considerscurve'
				},
				type: FieldType.Boolean,
				model: 'updatePlannedQuantityConsiderScurve'
			},
			{
				id: 'updatePlannedQuantity',
				label: {
					key: 'estimate.main.wizardDialog.updatePlannedQuantity',
				},
				type: FieldType.Radio,
				model: 'updatePlannedQuantity',
				itemsSource: {
					items: [
						{
							id: 'IsSchedule',
							displayName: 'estimate.main.schedule'
						}
					]
				}
			},
			{
				id: 'updateLineItemQuantity',
				label: {
					key: 'estimate.main.updateLineItemQuantity'
				},
				type: FieldType.Radio,
				model: 'selectedItem',
				itemsSource: {
					items: [
						{
							id: 'IsSchedule',
							displayName: 'estimate.main.schedule'
						},
						{
							id: 'IsWip',
							displayName: 'estimate.main.wip'
						},
						{
							id: 'IsPes',
							displayName: 'estimate.main.pes'
						},
					],
				},
			},
			{
				id: 'isUpdateFQ',
				label: {
					key: 'estimate.main.isUpdateFQ',
				},
				type: FieldType.Boolean,
				model: 'isUpdateFQ',
			},
			{
				id: 'updateBillingQuantity',
				label: {
					key: 'estimate.main.wizardDialog.updateBillingQuantity',
				},
				type: FieldType.Radio,
				model: 'updateBillingQuantity',
				itemsSource: {
					items: [
						{
							id: 'IsBill',
							displayName: 'estimate.main.wizardDialog.salesBilling',
						},
					],
				},
			},
			{
				id: 'hintText',
				label: {
					key: 'estimate.main.wizardDialog.hintText',
				},
				type: FieldType.Text,
				model: 'hintText',
				readonly: true,
			},
		],
	};

	/**
	 * Method handle update quantity
	 */
	private updateQuantity(data: IEstimateUpdateQuantityPostData) {
		type EstimateLineItemWizardResponse = {
			success: string;
			message: string;
		};

		// Show loading indicator TODO showLoadingOverlay is not exist in estimateMainDynamicConfigurationService in old angularjs code
		// let estMainStandardDynamicService = inject('estimateMainDynamicConfigurationService');
		// estMainStandardDynamicService.showLoadingOverlay();

		if (data && data.ProjectId > 0 && data.EstHeaderFk > 0) {
			this.http.post<EstimateLineItemWizardResponse>(`${this.configService.webApiBaseUrl}estimate/main/lineitemquantity/updatequantity`, data).subscribe((response: EstimateLineItemWizardResponse) => {
				if (!response.success) {
					//TODO
					//estMainStandardDynamicService.hideLoadingOverlay();
					this.messageBoxService.showMsgBox(response.message, this.title, 'ico-warning', '', true);
				} else {
					this.estimateMainService.onDataRead.subscribe(() => {
						this.estimateMainService.setList(data.SelectedLineItem);
					});
					this.messageBoxService.showMsgBox('cloud.common.doneSuccessfully', this.title, 'ico-info');
				}
			});
		}
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOK(result: IEditorDialogResult<IEstimateLineItemUpdateQuantity>) {
		if (result && result.value !== undefined) {
			const selectedLineItem = this.estimateMainService.getSelection() ?? null;

			const postData: IEstimateUpdateQuantityPostData = {
				EstHeaderFk: this.estimateMaincontextService.getSelectedEstHeaderId(),
				ProjectId: this.estimateMaincontextService.getSelectedProjectId(),
				SelectedLineItem: selectedLineItem,
				IsSchedule: result.value.SelectedItem === 'IsSchedule',
				IsPes: result.value.SelectedItem === 'IsPes',
				IsWip: result.value.SelectedItem === 'IsWip',
				PlannedQuantityFrmSchedule: result.value.UpdatePlannedQuantity === 'IsSchedule',
				ConsiderScurve: result.value.UpdatePlannedQuantityConsiderScurve,
				BillingQuantityFrmBill: result.value.UpdateBillingQuantity === 'IsBill',
				IsCompletePerformance: result.value.IsCompletePerformance,
				IsUpdateFQ: result.value.IsUpdateFQ,
				EstLineItemIds: []
			};
			
			postData.ProjectId = (postData.ProjectId ?? (selectedLineItem?.length > 0 ? this.getProjectIdByLineItem(selectedLineItem) : 0));
			if (result.value.EstimateScope === 'SelectedLineItems') {
				// TODO				
				// if (platformSidebarWizardCommonTasksService.assertSelection(selectedLineItem, title, msg)) {
				// 	let selectedLineItems = this.estimateMainService.getSelection();
				// 	postData.EstLineItemIds = selectedLineItems && selectedLineItems.length ? selectedLineItems.map(item => item.Id) : null;
				// 	this.updateQuantity(postData);
				// }
			} else {
				this.updateQuantity(postData);
			}
		}
	}

	private getProjectIdByLineItem(selectedLineItem: IEstLineItemEntity[]) {
		return selectedLineItem.length > 0 ? selectedLineItem[0].ProjectFk : 0;
	}
}
