/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';
import { SaveModelObjectsActionEditorParams } from '../../enum/actions/save-model-objects-action-editor-params.enum';

/**
 * Configuration class for save model objects editor.
 */
export class SaveModelObjectsEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.showOutputGroup = false;
		this.createField(FieldType.Comment, SaveModelObjectsActionEditorParams.Objects, ParameterType.Input, 'Objects', {} as ICodemirrorEditorOptions);
	}

}