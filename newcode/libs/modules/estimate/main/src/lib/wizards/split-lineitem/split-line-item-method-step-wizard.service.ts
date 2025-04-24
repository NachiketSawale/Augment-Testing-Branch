/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { FieldType, FormStep, IFormConfig,createLookup } from '@libs/ui/common';
import { SplitLineItemConfiguration } from './estimate-main-split-line-item-configuration';
import { EstimateMainSplitLineItemMethodsLookupService } from './estimate-main-split-line-item-methods-lookup.service';

@Injectable({
    providedIn: 'root'
})
export class SplitLineItemMethodStep{
	public readonly title = 'estimate.main.splitLineItemWizard.splitByResourcesTypes';
	public readonly id = 'splitLineItemMethodsForm';
    private readonly estimateMainSplitLineItemMethodsLookupService = inject(EstimateMainSplitLineItemMethodsLookupService);
	
	/**
	 * Create Split LineItem Method Form
	 * @returns
	 */
	public createForm(): FormStep<SplitLineItemConfiguration>{
		 const fromStep =  new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
		fromStep.canFinish = false;
		return fromStep;
	}

	public ESTIMATE_SCOPE = {
		ALL_ESTIMATE: {
			value: 0,
			label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate',
		},
		RESULT_SET: {
			value: 1,
			label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet',
		},
		RESULT_HIGHLIGHTED: {
			value: 2,
			label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted',
		},
	};

	private createFormConfiguration():IFormConfig<SplitLineItemConfiguration>{

		return {
			formId: 'splitLineItemMethodsForm',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''}
				},
			],
			rows: [
				{
					id: 'resultSet',
					label: { key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label' },
					type: FieldType.Radio,
					model: 'resultSet',
					itemsSource: {
						items: [
							{
								id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
								displayName: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.label,
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
					id: 'splitMethod',
					model: 'splitMethod',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.estimateMainSplitLineItemMethodsLookupService.createLookupService(),
						showClearButton: true
					}),
					
					label: {
						'text': 'Type',
						'key': 'cloud.common.entityType'
					},
					required: true
				}
			]
		};
	}
}