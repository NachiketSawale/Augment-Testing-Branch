/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormRow, ICodemirrorEditorOptions, ISelectItem } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CreateContractFromQuoteActionEditorParams } from '../../enum/actions/create-contract-from-quote-action-editor-params.enum';

/**
 * Configuration class for Create Contract From Quote Action Editor.
 */
export class CreateContractFromQuoteActionEditor extends ActionEditorBase {
	public readonly radioSelectOptions: ISelectItem<string>[] = [{
		id: 'multip',
		displayName: 'basics.workflow.action.customEditor.createContracts',
	},
	{
		id: 'merge',
		displayName: 'basics.workflow.action.customEditor.createOneContract'
	}];

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Comment, CreateContractFromQuoteActionEditorParams.QtnId, ParameterType.Input, 'basics.workflow.action.customEditor.entityId', {} as ICodemirrorEditorOptions);
		this.createFieldByForm(this.radioButtons());
		this.createField(FieldType.Comment, CreateContractFromQuoteActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.resultContex', {} as ICodemirrorEditorOptions);
	}

	private radioButtons(): FormRow<IWorkflowAction> {
		return {
			type: FieldType.Radio,
			id: CreateContractFromQuoteActionEditorParams.CreateContractOption,
			groupId: ParameterType.Input,
			model: this.getModel(CreateContractFromQuoteActionEditorParams.CreateContractOption, ParameterType.Input),
			label: {key: 'basics.workflow.action.customEditor.con'},
			itemsSource: {
				items: this.radioSelectOptions
			},
		};
	}
}