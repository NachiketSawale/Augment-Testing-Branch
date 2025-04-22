/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { StartWorkflowActionParamsEnum } from '../../enum/actions/start-workflow-action-params.enum';
import { WorkflowTemplateLookup } from '../../../services/workflow-lookup/action-editors/workflow-template-reducest-lookup.service';
import { IWorkflowTemplateReduced } from '../../interfaces/workflow-template-reduced.interface';

/**
 * Configuration class for mail action editor.
 */
export class StartWorkflowActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.createField(FieldType.Comment, StartWorkflowActionParamsEnum.EntityId, ParameterType.Input, 'basics.workflow.action.customEditor.entityId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartWorkflowActionParamsEnum.StartContext, ParameterType.Input, 'basics.workflow.action.customEditor.startContext', {} as ICodemirrorEditorOptions);
		this.createLookupEditorMode<IWorkflowTemplateReduced>(StartWorkflowActionParamsEnum.WorkflowId, ParameterType.Input, 'basics.workflow.template.type.1', WorkflowTemplateLookup);
		this.createField(FieldType.Comment, StartWorkflowActionParamsEnum.CallingInstanceId, ParameterType.Input, 'basics.workflow.action.customEditor.callingInstanceId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartWorkflowActionParamsEnum.Hours2Live, ParameterType.Input, 'basics.workflow.action.customEditor.hours2Live', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, StartWorkflowActionParamsEnum.ResultContext, ParameterType.Output, 'basics.workflow.action.customEditor.resultContex', editorOptions);
	}
}