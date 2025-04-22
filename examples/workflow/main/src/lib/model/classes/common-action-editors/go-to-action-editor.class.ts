/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { GoToActionEditorParams } from '../../enum/actions/go-to-action-params.enum';
import { IGoToActionCodeDisplayType } from '../../types/workflow-goto-action-editor-param.type';
import { GoToActionCodeLookupService } from '../../../services/workflow-lookup/action-editors/workflow-goto-action-code-lookup.service';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';

/**
 * Configuration class for goTo action editor.
 */
export class GoToActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.showOutputGroup = false;

		this.createField<IGoToActionCodeDisplayType>(FieldType.Lookup, GoToActionEditorParams.Code, ParameterType.Input, 'basics.workflow.action.customEditor.code', {} as ICodemirrorEditorOptions, GoToActionCodeLookupService);
	}
}