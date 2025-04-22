/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { StartApproverWorkflowActionEditorParams } from '../../enum/actions/start-approver-workflow-action-editor-params.enum';
import { WorkflowGenericWizardUseCaseLookup } from '../../../services/workflow-lookup/action-editors/workflow-generic-wizard-use-case-lookup.service';
import { WorkflowTemplateEntityLookup } from '../../../services/workflow-lookup/action-editors/workflow-template-entity-lookup.service';

export class StartApproverWorkflowActionEditor extends ActionEditorBase {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Lookup, StartApproverWorkflowActionEditorParams.UseCaseUUid, ParameterType.Input, 'basics.workflow.action.customEditor.useCaseConfig', {} as ICodemirrorEditorOptions, WorkflowGenericWizardUseCaseLookup);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.MainEntityId, ParameterType.Input, 'basics.workflow.action.customEditor.entityId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Lookup, StartApproverWorkflowActionEditorParams.WorkflowTemplateId, ParameterType.Input, 'basics.workflow.action.customEditor.approverWorkflow', {} as ICodemirrorEditorOptions, WorkflowTemplateEntityLookup);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.ClassifiedNumber, ParameterType.Input, 'basics.workflow.action.customEditor.classifiedNumber', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.ClassifiedDate, ParameterType.Input, 'basics.workflow.action.customEditor.classifiedDate', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.ClassifiedAmount, ParameterType.Input, 'basics.workflow.action.customEditor.classifiedAmount', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.ClassifiedText, ParameterType.Input, 'basics.workflow.action.customEditor.classifiedText', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.aproverInfo', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, StartApproverWorkflowActionEditorParams.ConfigErrors, ParameterType.Output, 'basics.workflow.action.customEditor.configErrors', {} as ICodemirrorEditorOptions);
	}
}