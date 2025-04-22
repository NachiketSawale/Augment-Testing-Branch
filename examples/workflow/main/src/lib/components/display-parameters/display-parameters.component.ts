/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { FieldType, IFieldValueChangeInfo, IFormConfig } from '@libs/ui/common';
import { IWorkflowParameter } from '@libs/workflow/shared';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { PropertyType } from '@libs/platform/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';

/**
 * Shared component used to render input/output parameters for workflow module.
 */
@Component({
	selector: 'workflow-main-display-parameters',
	templateUrl: './display-parameters.component.html',
	styleUrls: ['./display-parameters.component.scss'],
})
export class DisplayParametersComponent implements OnChanges {

	@Input()
	public selectedAction!: IWorkflowAction;

	/**
	 * Input parameters to be displayed as form fields.
	 */
	@Input()
	public parameters: IWorkflowParameter[] = [];

	/**
	 * Form configuration that will be used to render form fields.
	 */
	public formConfig: IFormConfig<IWorkflowAction> = {
		rows: []
	};

	private readonly actionService = inject(BasicsWorkflowActionDataService);

	public ngOnChanges(changes: SimpleChanges): void {
		this.prepareFormConfig(this.parameters);
	}
	public entity!: IWorkflowAction | null;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	/**
	 * Prepares the form configuration used to render codemirror form fields.
	 * @param inputParams
	 * @returns IFormConfig<IActionInputField>
	 */
	private prepareFormConfig(inputParams: IWorkflowParameter[]): void {
		this.entity = {} as IWorkflowAction;
		this.formConfig = { rows: [] };

		this.changeDetectorRef.detectChanges();

		const formConfig: IFormConfig<IWorkflowAction> = {
			formId: 'workflow-parameters-form',
			rows: []
		};

		inputParams.forEach((inputParamItem) => {

			const change = (changeInfo: IFieldValueChangeInfo<IWorkflowAction, PropertyType>) => {
				this.actionService.setFieldModified(inputParamItem.key, changeInfo.newValue);
			};

			formConfig.rows.push({
				id: inputParamItem.key,
				label: inputParamItem.label,
				type: FieldType.Script,
				model: inputParamItem.key,
				editorOptions: inputParamItem.editorOptions,
				required: false,
				change,
			});
			//this.selectedAction[inputParamItem.key] = inputParamItem.value;
		});
		this.formConfig = formConfig;
		this.entity = this.selectedAction;
	}

}
