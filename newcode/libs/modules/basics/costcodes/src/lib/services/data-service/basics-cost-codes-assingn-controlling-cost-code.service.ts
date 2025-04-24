/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IControllingCostCodes } from '../../model/interfaces/basics-cost-codes-controlling-cost-codes.interface';

/**
 * BasicsCostCodesAssingnControllingCostCodes
 */
@Injectable({ providedIn: 'root' })
export class BasicsCostCodesAssingnControllingCostCodes {
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

	 public value: IControllingCostCodes = {
		ShowAssignToChildren: false,
		ShowOverwrite: true,
		ShowPreserveSelection: true,
		IsOverwrite: true,
		IsAssignToChildren: true,
		IsPreserveSelection: false
	};

	/**
	 * @brief Opens a dialog to control cost codes and handles the result when the user interacts with it.
	 * @returns {Promise<IControllingCostCodes | null>} A promise that resolves to `null` since the result is handled within the method.
	 */
	public async controllingCostCodes(): Promise<IControllingCostCodes | null> {
		const result = await this.formDialogService.showDialog<IControllingCostCodes>({
			id: 'updateEstimate',
			headerText: 'estimate.main.updateItemsFromProject',
			formConfiguration: this.prepareFormConfig<IControllingCostCodes>(),
			entity: this.value,
			runtime: undefined,
			customButtons: [],
			topDescription: ''
		});

		if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			this.handleOk(result);
			return result.value;
		}

		return null;
	}
	
	/**
	 * Prepares the form configuration for the specified entity.
	 */
	public prepareFormConfig<IControllingCostCodes extends object>(): IFormConfig<IControllingCostCodes> {
		 const formConfig: IFormConfig<IControllingCostCodes> = {
			formId: 'basics.costcodes.controlling.assignToCostCodeTitle',
			showGrouping: true,
			groups: [
				{
					groupId: 'baseGroup',
					header: { key: 'estimate.main.updateSetting' },
					open: true
				}
			],
			rows: [
				{
					groupId: 'baseGroup',
					id: 'isOverwrite',
					label: {
						key: 'basics.costcodes.controlling.assignToChildCostCodes'
					},
					type: FieldType.Boolean,
					model: 'isOverwrite'
				},
				{
					groupId: 'baseGroup',
					id: 'updPrjMat',
					label: {
						key: 'basics.costcodes.controlling.preserveSelection'
					},
					type: FieldType.Boolean,
					model: 'updPrjMat',
				},
				{
					groupId: 'baseGroup',
					id: 'isPreserveSelection',
					label: {
						key: 'estimate.main.updateProjectAssemblies'
					},
					type: FieldType.Boolean,
					model: 'isPreserveSelection'
				},
			]
		};

		return formConfig;
	}

	/**
	 * @brief Handles the dialog result when the user clicks "OK" and updates the current value based on the result.
	 * @param result The dialog result of type `IEditorDialogResult<IControllingCostCodes>` containing the updated values.
	 * @returns {IControllingCostCodes} The updated `IControllingCostCodes` object.
	 */
	private handleOk(result: IEditorDialogResult<IControllingCostCodes>): IControllingCostCodes {
		this.value.ShowOverwrite = result.value?.IsOverwrite;
		this.value.IsAssignToChildren = result.value?.IsAssignToChildren;
		this.value.IsPreserveSelection = result.value?.IsPreserveSelection;

		return this.value;
	}
}
