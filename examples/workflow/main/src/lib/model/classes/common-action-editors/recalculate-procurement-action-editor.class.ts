/*
 * Copyright(c) RIB Software GmbH
 */
import { ActionEditorBase } from './action-editor-base.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { RecalculateProcurementActionParamsEnum } from '../../enum/actions/recalculate-procurement-action-editor-params.enum';
import { WorkflowEntityLookup } from '../../../services/workflow-lookup/workflow-entity-lookup.service';

export class RecalculateProcurementActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, RecalculateProcurementActionParamsEnum.Id, ParameterType.Input, 'basics.workflow.action.customEditor.id', {} as ICodemirrorEditorOptions);
		this.createLookupEditorMode(RecalculateProcurementActionParamsEnum.EntityName, ParameterType.Input, 'basics.workflow.action.customEditor.entityName', WorkflowEntityLookup);
		this.createField(FieldType.Comment, RecalculateProcurementActionParamsEnum.IsSuccess, ParameterType.Output, 'basics.workflow.action.customEditor.isSuccess', {} as ICodemirrorEditorOptions);
	}
}