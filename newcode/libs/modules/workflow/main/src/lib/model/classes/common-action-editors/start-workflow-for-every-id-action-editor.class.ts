/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { StartWorkflowForEveryIdActionParamsEnum } from '../../enum/actions/start-workflow-for-every-id-action-editor-params.enum';
import { WorkflowTemplateLookup } from '../../../services/workflow-lookup/action-editors/workflow-template-reducest-lookup.service';
import { IWorkflowTemplateReduced } from '../../interfaces/workflow-template-reduced.interface';

/**
 * Configuration class for start workflow for every id action editor.
 */
export class StartWorkflowForEveryIdActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.createField(FieldType.Comment, StartWorkflowForEveryIdActionParamsEnum.EntityIdArray, ParameterType.Input, 'basics.workflow.action.customEditor.entityIdArray', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartWorkflowForEveryIdActionParamsEnum.StartContext, ParameterType.Input, 'basics.workflow.action.customEditor.startContext', {} as ICodemirrorEditorOptions);
		this.createLookupEditorMode<IWorkflowTemplateReduced>(StartWorkflowForEveryIdActionParamsEnum.TemplateId, ParameterType.Input, 'basics.workflow.action.customEditor.templateId', WorkflowTemplateLookup);
		this.createField(FieldType.Comment, StartWorkflowForEveryIdActionParamsEnum.CallingInstanceId, ParameterType.Input, 'basics.workflow.action.customEditor.callingInstanceId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Script, StartWorkflowForEveryIdActionParamsEnum.ResultContext, ParameterType.Output, 'basics.workflow.action.customEditor.resultContex', editorOptions);
	}
}