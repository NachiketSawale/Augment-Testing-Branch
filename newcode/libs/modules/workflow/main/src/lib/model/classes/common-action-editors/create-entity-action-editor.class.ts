/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { EntityActionsParamsEnum } from '../../enum/actions/entity-actions-params.enum';
import { WorkflowCreateEntityActionLookup } from '../../../services/workflow-lookup/action-editors/workflow-create-entity-action-lookup.service';

/**
 * Configuration class for get entity action editor.
 */
export class CreateEntityActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.createLookupEditorMode(EntityActionsParamsEnum.EntityIdForCreateEntityAction, ParameterType.Input, 'basics.workflow.action.customEditor.statusName', WorkflowCreateEntityActionLookup);
		this.createField(FieldType.Comment, EntityActionsParamsEnum.EntityProperty, ParameterType.Output, 'basics.workflow.action.customEditor.outputSaveObject', editorOptions);
	}
}