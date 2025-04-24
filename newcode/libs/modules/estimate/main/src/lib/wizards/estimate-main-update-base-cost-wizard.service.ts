/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType,IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { EstimateMainService} from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstimateUpdateBaseCost } from '../model/interfaces/estimate-main-update-base-cost.interface';

@Injectable({ providedIn: 'root' })

/**
 *
 *  This services for provides functionality for update base cost.
 */
export class EstimateMainUpdateBaseCostWizardService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	public scopeSelectionService = inject(EstimateMainScopeSelectionWizardService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	private title = 'estimate.main.updateBaseCost';
	private noteText = 'estimate.main.generateBaseCost';
	private rows = this.scopeSelectionService.prepareFormConfig().rows;

	private entity: IEstimateUpdateBaseCost = {
		EstimateScope: 0,
		GenerateBaseCost: 'IsGenerateBaseCost',
		NoteText: this.noteText,
	};

	/**
	 * Displays a wizard dialog.
	 */
	public updateBaseCost() {
		// this.rows.forEach((row:unknown) => {
		// 	if (!this.formConfiguration.rows.some((existingRow) => existingRow.model === 'EstimateScope')) {
		// 		row.sortOrder = 1;
		// 		row.model = 'EstimateScope';
		// 		this.formConfiguration.rows.push(row as unknown as FormRow<IEstimateUpdateBaseCost>);
		// 	}
		// });

		const result = this.formDialogService
			.showDialog<IEstimateUpdateBaseCost>({
				id: 'updateBaseCost',
				headerText: 'estimate.main.updateBaseCost',
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
	private formConfiguration: IFormConfig<IEstimateUpdateBaseCost> = {
		formId: 'estimate.main.updateBaseCost',
		showGrouping: false,
		rows: [
			{
				id: 'generateBaseCost',
				label: {
					key: 'estimate.main.updateBaseCost',
				},
				type: FieldType.Radio,
				model: 'GenerateBaseCost',
				sortOrder: 2,
				itemsSource: {
					items: [
						{
							id: 'IsGenerateBaseCost',
							displayName: 'estimate.main.isGenerateBaseCost',
						},
						{
							id: 'IsUpdateBaseCost',
							displayName: 'estimate.main.isUpdateBaseCost',
						},
					],
				},
				change: (result) => {
					if (result.field.label === 'IsGenerateBaseCost') {
						result.entity.NoteText = 'estimate.main.generateBaseCost';
					} else {
						result.entity.NoteText = 'estimate.main.updateBaseCostDescription';
					}
				},
			},
			{
				id: 'noteText',
				label: {
					key: 'estimate.main.note',
				},
				type: FieldType.Text,
				model: 'hintText',
				sortOrder: 3,
				readonly: true,
			},
		],
	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IEstimateUpdateBaseCost>): void {
		type EstimateUpdateBaseCostPostData = {
			EstHeaderFk: number;
			ProjectId: number;
			GenerateOrUpdateBaseCost: string;
			SelectedLevel: string;
			SelectedItemId: number | null;
			LineItemIds: number[];
		};

		if (!result || !result.value) {
			return;
		}

		if ((result.value.EstimateScope === 1 || result.value.EstimateScope === 2) && this.getIfSelectedIdElse(-1) <= 0) {
			return;
		}

		const postData: EstimateUpdateBaseCostPostData = {
			EstHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
			ProjectId: this.estimateMainContextService.getSelectedProjectId(),
			GenerateOrUpdateBaseCost: result.value.GenerateBaseCost,
			SelectedLevel: this.getEstimateScope(result.value.EstimateScope),
			SelectedItemId: this.getIfSelectedIdElse(-1),
			LineItemIds: this.estimateMainService.getSelection().map((entity) => entity.Id),
		};

		this.http.post<EstimateUpdateBaseCostPostData>(`${this.configService.webApiBaseUrl}estimate/main/lineitem/updatelineitemsbasecost`, postData).subscribe((response) => {
			this.estimateMainService.listChanged$.subscribe((res) => {
				const selected = res.find((item) => item.Id === postData.SelectedItemId);
				this.estimateMainService.select([selected as IEstLineItemEntity]);
			});
		});
	}

	/**
	 * Method to get esstimate scope
	 */
	private getEstimateScope(estimateScope: number): string {
		if (estimateScope === 1 || estimateScope === 2) {
			return 'SelectedLineItems';
		} else if (estimateScope === 0) {
			return 'AllItems';
		}

		return '';
	}

	/**
	 * Function to get id of the line item
	 * @returns line item id
	 */
	private getIfSelectedIdElse(elseValue: number): number {
		const sel = this.estimateMainService.getSelectedEntity();
		return sel?.Id ?? elseValue;
	}
}
