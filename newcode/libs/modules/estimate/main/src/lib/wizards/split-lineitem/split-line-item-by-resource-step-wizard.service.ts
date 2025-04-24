/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { SplitByResourcesForm } from './estimate-main-split-line-item-configuration';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SplitLineItemByResourceStep{
	public readonly title = 'estimate.main.splitLineItemWizard.splitByResources';
	public readonly id = 'splitByResourcesForm';

	/**
	 * Create Split LineItem By Resource Form
	 * @param splitByResourcesForm 
	 * @returns 
	 */
	public createForm(splitByResourcesForm : SplitByResourcesForm): FormStep<SplitByResourcesForm>{
		const fromStep = new FormStep(this.id,this.title, this.createFormConfiguration(), splitByResourcesForm);
		fromStep.canFinish = true;
		return fromStep;
	}
	private createFormConfiguration():IFormConfig<SplitByResourcesForm>{

		return {
			formId: this.id,
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				{
					groupId: 'selectScope',
					id: 'splitByResourcesOptions',
					label: { key: 'estimate.main.selectUpdatePolicy' },
					type: FieldType.Radio,
					model: 'splitByResourcesOptions',
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: { key: 'estimate.main.splitLineItemWizard.noCriteria'},
							},
							{
								id: 2,
								displayName: { key: 'estimate.main.splitLineItemWizard.costPortions' },
							},
						],
					},
				}
			]
		};
	}
}