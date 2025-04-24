/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';
import { EstimateMainContextService, LineItemBaseComplete } from '@libs/estimate/shared';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstimateScope } from '../model/interfaces/estimate-main-spread-budget.interface';

@Injectable({ providedIn: 'root' })

/**
 *  EstimateMainSpreadBudgetWizard
 *  This services for provides functionality for spreading budgets.
 */
export class EstimateMainSpreadBudgetWizardService extends EstimateMainScopeSelectionWizardService {
	private http = inject(HttpClient);
	public override formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);

	public genrateBudget: IEstimateScope = {
		estimateScope: 0,
		EstLineItems :[]		
	};

    /**
	 * Displays a dialog.
	 */
	public async splitBudget() {
		const result = await this.formDialogService
			.showDialog<IEstimateScope>({
				id: 'splitbudget',
				headerText: this.setHeader(),
				formConfiguration: this.prepareFormConfig<IEstimateScope>(),
				entity: this.genrateBudget,
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
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IEstimateScope>): void {
		this.splitItemBudget(result);
	}

    
	/**
	 * This method overrides the base class method to set the header for the split budget
	 */
	public override setHeader(): string {
		return 'estimate.main.splitBudget';
	}

	/**
	 * Prepares the form configuration for the specified entity.
	 */
	public override prepareFormConfig<TEntity extends object>(): IFormConfig<TEntity> {
		const formConfig: IFormConfig<TEntity> = {
			formId: 'estimate.main.splitBudget',
			rows: [
				{
					id: 'radio',
					label: { key: 'estimate.main.splitBudget' },
					type: FieldType.Radio,
					model: 'estimateScope',
					itemsSource: {
						items: [
							{
								id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
								displayName: this.ESTIMATE_SCOPE.RESULT_SET.label
							},
							{
								id: this.ESTIMATE_SCOPE.RESULT_SET.value,
								displayName: { key: this.ESTIMATE_SCOPE.RESULT_SET.label }
							},

							{
								id: this.ESTIMATE_SCOPE.ALL_ESTIMATE.value,
								displayName: { key: this.ESTIMATE_SCOPE.ALL_ESTIMATE.label }
							}
						]
					}
				}
			]
		};

		return formConfig;
	}

	private defaultItem: IEstimateScope = {
		estimateScope: 0,
		EstLineItems: []
	};

	/**
	 * Returns the default entity for the specified type.
	 */
	public override defaultEntity<TEntity>(): TEntity {
		return this.defaultItem as TEntity;
	}

	/**
	 * Splits the item budget.
	 */
	public splitItemBudget(result: IEditorDialogResult<IEstimateScope>) {
		const postData = {
			EstHeaderFk: this.estimateMainContextService.selectedEstHeaderFk,
			ProjectId: this.estimateMainContextService.getSelectedProjectId(),
			SelectedItemId: this.estimateMainService.getSelection()[0]?.Id
		};
	
		this.http.post<LineItemBaseComplete>(`${this.configService.webApiBaseUrl}estimate/main/calculator/splitbudget`, postData).subscribe((response) => {
			const lineItems = response?.EstLineItems ?? null;
			if (!lineItems) {
				return;
			}
	
			this.estimateMainService.addList(lineItems);
			this.estimateMainService.select(response as IEstLineItemEntity[]);
	
			if (result.value && (result.value as IEstimateScope).estimateScope === 2) {
				(result.value as IEstimateScope).EstLineItems = this.estimateMainService.getSelection();
			} else if (result.value && (result.value as IEstimateScope).estimateScope === 1) {
				(result.value as IEstimateScope).EstLineItems = this.estimateMainService.getSelection();
			}
	
			this.estimateMainService.getList();
		});
	}
	
}
