/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { AllowanceOption, IGenrateBudget, IlocalData } from '../model/interfaces/estimate-main-generate-budget.interface';


type AllowanceType = 'GC' | 'AM' | 'GA' | 'RP';

@Injectable({ providedIn: 'root' })

/**
 *  EstimateMainGenarteBudgetWizardService
 *  This services for provides functionality for generating budgets
 */
export class EstimateMainGenarteBudgetWizardService extends EstimateMainScopeSelectionWizardService {
	private estScope: number = 2;
	private estFactor: number = 1;
	private budgetFrm: number = 1;
	private http = inject(HttpClient);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	public override formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly estimateMainService = inject(EstimateMainService);
	private localData: IlocalData = {};
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly headerText = 'defect.main.createChangeFromDefect';
	public skipFixedBudgetItems = this.localData?.skipFixedBudgetItems ?? false;
	private async showInfo(bodyText: string) {
		await this.messageBoxService.showMsgBox(bodyText, this.headerText, 'info');
	}

	/**
	 *  generates a budget..
	 */

	public async generateBudget() {
		const param = {
			EstHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
		};
		this.http.post(`${this.configService.webApiBaseUrl}estimate/main/estimateallowance/getEstimateAllowances`, param).subscribe((response) => {
			this.isAtciveStandardAllowance = false;
			if (response) {
				const list = response as IGenrateBudget[];
				this.isAtciveStandardAllowance = list.length > 0;
			}
		});
		const result = await this.formDialogService
			.showDialog<IGenrateBudget>({
				width: '800',
				id: 'estimate.main.generateBudget',
				headerText: { key: 'estimate.main.generateBudget' },
				formConfiguration: this.genrateBudgetformConfiguration,
				entity: this.genrateBudget,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					const withAllowances = (result.value?.StandardAllowanceOption as AllowanceOption[])?.filter((item: AllowanceOption) => item.checked === true);
					const allowanceTypes: AllowanceType[] = withAllowances ? withAllowances.map((item) => item.value as AllowanceType) : [];

					if (result.value?.EstScope === this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value && this.estimateMainService.getIfSelectedIdElse(0)) {
						this.messageBoxService.showErrorDialog('estimate.main.updateMaterialPackageWizard.selectLineItemTip');
					}

					const lineItemIds = result.value?.EstScope === this.ESTIMATE_SCOPE.ALL_ESTIMATE.value ? this.estimateMainService.getList().map((item) => item.Id) : [this.estimateMainService.getSelectedEntity()?.Id].filter((id) => id !== undefined);

					if (result.value?.EstScope === this.ESTIMATE_SCOPE.ALL_ESTIMATE.value  && lineItemIds.length <= 0) {
						this.messageBoxService.showErrorDialog('estimate.main.estConfigDialogLoadEstimate');
					}

					const postData = {
						EstHeaderFk: this.estimateMainContextService.selectedEstHeaderFk,
						ProjectId: this.estimateMainContextService.getSelectedProjectId(),
						Factor: result.value?.Factor,
						EstScope: result.value?.EstScope,
						isAtciveStandardAllowance: this.isAtciveStandardAllowance,
						SelectedItemId: this.estimateMainService.getSelection()[0]?.Id,
						LineItemIds: lineItemIds.filter((id): id is number => id !== undefined), 
						budgetFrm: result.value?.budgetFrm,
						GC: allowanceTypes.includes('GC'),
						AM: allowanceTypes.includes('AM'),
						GA: allowanceTypes.includes('GA'),
						RP: allowanceTypes.includes('RP'),
						SkipFixedBudgetItems: result.value?.SkipFixedBudgetItems,
					};

					this.generateBudgetFun(postData);
				}
			});

		return result;
	}

	private isAtciveStandardAllowance = false;

	private genrateBudget: IGenrateBudget = {
		EstScope: this.estScope,
		Factor: this.estFactor,
		budgetFrm: this.budgetFrm,
		isAtciveStandardAllowance: this.isAtciveStandardAllowance,
		SkipFixedBudgetItems: this.skipFixedBudgetItems,
		LineItemIds: []
	};

	/**
	 * Form configuration data.
	 */
	private genrateBudgetformConfiguration: IFormConfig<IGenrateBudget> = {
		formId: 'estimate.main.budgetFrm',

		showGrouping: true,
		rows: [
			{
				id: 'estimateScope',
				label: {
					key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
				},
				type: FieldType.Radio,
				model: 'budgetFrm',
				itemsSource: {
					items: [
						{
							id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
							displayName: this.ESTIMATE_SCOPE.RESULT_SET.label,
						},
						{
							id: this.ESTIMATE_SCOPE.RESULT_SET.value,
							displayName: { key: this.ESTIMATE_SCOPE.RESULT_SET.label },
						},

						{
							id: this.ESTIMATE_SCOPE.ALL_ESTIMATE.value,
							displayName: { key: this.ESTIMATE_SCOPE.ALL_ESTIMATE.label }
						}
					]
				}
			},

			{
				id: 'budgetFrm',
				label: {
					key: 'estimate.main.budgetFrm',
				},
				type: FieldType.Radio,
				model: 'budgetFrm',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: { key: 'estimate.main.grandTotal' },
						},
						{
							id: 2,
							displayName: { key: 'estimate.main.revenue' },
						},
						{
							id: 3,
							displayName: { key: 'estimate.main.baseCostTotal' },
						},
						{
							id: 4,
							displayName: { key: 'estimate.main.costTotal' }
						},
					]
				}
			},

			{
				id: 'xfactor',
				label: {
					key: 'estimate.main.xFactor',
				},
				type: FieldType.Decimal,
				model: 'factor'
			},
		],
	};

	private async showSuccessfullyDoneMessage() {
		await this.showInfo('estimate.main.generateBudget');
	}

	/**
	 *
	 * This method for generate a budget.
	 */
	private generateBudgetFun(postData: IGenrateBudget) {
		this.http.post(`${this.configService.webApiBaseUrl}estimate/main/lineitem/generatebudget`, postData).subscribe((response) => {
			if (response) {
				this.estimateMainService.addList(response as IEstLineItemEntity[]);
				this.estimateMainService.select(response as IEstLineItemEntity[]);
				this.showSuccessfullyDoneMessage();
			}
		});
	}
}
