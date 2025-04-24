/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';
import { TakeoverBoqActionEditorParams } from '../../enum/actions/takeover-boq-action-params.enum';

/**
 * Configuration class for Takeover BoQ editor.
 */
export class TakeoverBoqEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Comment,TakeoverBoqActionEditorParams.SourceBoqHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.boq.boqHeaderId',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,TakeoverBoqActionEditorParams.TargetModuleHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.boq.targetHeaderId',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,TakeoverBoqActionEditorParams.TargetModuleName, ParameterType.Input, 'basics.workflow.action.customEditor.boq.moduleName',{} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment,TakeoverBoqActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult',{} as ICodemirrorEditorOptions);
	}

}