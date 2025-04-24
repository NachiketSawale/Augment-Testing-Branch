/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { RecalculateBoqValuesActionParams } from '../../enum/actions/recalculate-boq-values-action-editor-params.enum';

/**
 * Configuration class for Recalculate Boq Values action editor.
 */
export class RecalculateBoqValuesActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, RecalculateBoqValuesActionParams.BoqHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.boq.boqHeaderId',	{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, RecalculateBoqValuesActionParams.TargetHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.boq.targetHeaderId',	{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, RecalculateBoqValuesActionParams.ModuleName, ParameterType.Input, 'basics.workflow.action.customEditor.boq.moduleName',	{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, RecalculateBoqValuesActionParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult',	{} as ICodemirrorEditorOptions);
	}
}