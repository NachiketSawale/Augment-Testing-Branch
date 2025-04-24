/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { GetClerkFromProjectActionEditorParams } from '../../enum/actions/get-clerk-from-project-action-editor-params.enum';
import { WorkflowClerkRoleLookup } from '../../../services/workflow-lookup/action-editors/workflow-clerk-role-lookup.service';
import { ProjectSharedLookupService } from '@libs/project/shared';

/**
 * Configuration class for Get Clerk From Project action editor.
 */
export class GetClerkFromProjectActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Lookup,GetClerkFromProjectActionEditorParams.ProjectId, ParameterType.Input, 'basics.workflow.action.customEditor.project', {} as ICodemirrorEditorOptions, ProjectSharedLookupService);
		this.createField(FieldType.Lookup,GetClerkFromProjectActionEditorParams.ClerkRoleId, ParameterType.Input, 'basics.workflow.action.customEditor.clerkRole', {} as ICodemirrorEditorOptions, WorkflowClerkRoleLookup);
		this.createField(FieldType.Comment, GetClerkFromProjectActionEditorParams.ProjectClerk, ParameterType.Output, 'basics.workflow.action.customEditor.projectClerk', {} as ICodemirrorEditorOptions);
	}
}