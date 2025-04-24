/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig,IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';

@Injectable({ providedIn: 'root' })
export class EstimateMainScopeSelectionWizardService {
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

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
			label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted'
		}
	};

	/**
	 * Show a dialog for editing a TEntity object.
	 */
	public showDailog<TEntity extends object>() {
		const config: IFormDialogConfig<TEntity> = {
			headerText: this.setHeader(),
			formConfiguration: this.prepareFormConfig<TEntity>(),
			customButtons: [],
			entity: this.defaultEntity<TEntity>(),
		};
		return this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<TEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value){ /* empty */ }
		});
	}

	/**
	 * Get the header text for the dialog.
	 * @returns {string} The header text.
	 */
	public setHeader(): string {
		return 'header';
	}

	/**
	 * Prepare the configuration for the form.
	 */
	public prepareFormConfig<TEntity extends object>(): IFormConfig<TEntity> {
		const formConfig: IFormConfig<TEntity> = {
			rows: [
				{
					id: 'radio',
					label: { key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label' },
					type: FieldType.Radio,
					model: 'estimateScope',
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
				}
			]
		};
         return formConfig;	
	}

	/**
	 * Returns the default entity for the specified type..
	 */
	public defaultEntity<TEntity>(): TEntity {
		throw new Error('Method not implemented.');
	}
}
