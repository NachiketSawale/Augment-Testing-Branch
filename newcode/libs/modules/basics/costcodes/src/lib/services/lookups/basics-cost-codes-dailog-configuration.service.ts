/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { ICostCodesStructure } from '../../model/interfaces/basic-costcodes-structure.interface';

/**
 * Basics Cost Codes Dailog Configuration Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostcodesDailogConfigurationService {
	private formDialogService: UiCommonFormDialogService;
	public constructor() {
		this.formDialogService = inject(UiCommonFormDialogService);
	}

	public async openBoqPropertiesDialog(costCodesStructureEntity: ICostCodesStructure) {
		const result = await this.formDialogService
			.showDialog<ICostCodesStructure>({
				id: '',
				headerText: { key: '' },
				formConfiguration: this.FormConfig,
				entity: costCodesStructureEntity,
				runtime: undefined,
				customButtons: [
					{
						id: 'reset',
						caption: { key: '' }
					}
				],
				topDescription: '',
				width: '1200px',
				maxHeight: 'max'
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				} else {
					this.handleCancel(result);
				}
			});
		return result;
	}
	private handleOk(result: IEditorDialogResult<ICostCodesStructure>): void {
		//this.assignControllingCostCodeResponse(contrCostCodeId, costCode, isOverwrite, isAssignToChildren)
	}

	private handleCancel(result?: IEditorDialogResult<ICostCodesStructure>): void {}

	private FormConfig: IFormConfig<ICostCodesStructure> = {
		formId: '',
		showGrouping: false,
		rows: [
			{
				id: 'showAssignToChildren',
				model: 'showAssignToChildren',

				label: {
					text: 'Assign Controlling Cost Code to immediate Child Cost Codes',
				},
				type: FieldType.Boolean,
				visible: true
			}
		]
	};
}
