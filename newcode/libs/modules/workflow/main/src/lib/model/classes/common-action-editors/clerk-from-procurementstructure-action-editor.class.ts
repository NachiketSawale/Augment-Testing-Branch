/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';
import { ClerkFromProcurementstructureActionEditorParams } from '../../enum/actions/clerk-from-procurementstructure-action-params.enum';
import { BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { WorkflowClerkRoleLookup } from '../../../services/workflow-lookup/action-editors/workflow-clerk-role-lookup.service';

/**
 * Configuration class for Clerk from Procurementstructure editor.
 */
export class ClerkFromProcurementstructureActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createLookupEditorMode(ClerkFromProcurementstructureActionEditorParams.Structure, ParameterType.Input, 'basics.workflow.action.customEditor.structure',BasicsSharedProcurementStructureLookupService);
		this.createLookupEditorMode(ClerkFromProcurementstructureActionEditorParams.ClerkRole, ParameterType.Input, 'basics.workflow.action.customEditor.clerkRole', WorkflowClerkRoleLookup);
		this.createField(FieldType.Comment,ClerkFromProcurementstructureActionEditorParams.Clerk, ParameterType.Output, 'basics.workflow.action.customEditor.clerk',{} as ICodemirrorEditorOptions);
	}

}