/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { EntityDataActionParamsEnum } from '../../enum/actions/entity-data-action-params.enum';
import { EntityDataActionTypeLookupService } from '../../../services/workflow-lookup/action-editors/workflow-entity-data-type-lookup.service';
import { WorkflowEntityDataFacadeLookupService } from '../../../services/workflow-lookup/action-editors/workflow-entity-data-facades-lookup.service';

/**
 * Configuration class for Entity Data action editor.
 */
export class EntityDataActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Lookup,EntityDataActionParamsEnum.EntityIdentifier, ParameterType.Input, 'basics.workflow.action.customEditor.entityDataAction.entityType', {} as ICodemirrorEditorOptions, WorkflowEntityDataFacadeLookupService);
		this.createField(FieldType.Lookup,EntityDataActionParamsEnum.OperationType, ParameterType.Input, 'basics.workflow.action.customEditor.entityDataAction.entityDataType', {} as ICodemirrorEditorOptions, EntityDataActionTypeLookupService);
		this.createField(FieldType.Comment, EntityDataActionParamsEnum.EntityIdentificationList, ParameterType.Input, 'basics.workflow.action.customEditor.entityDataAction.entityIdentificationList', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, EntityDataActionParamsEnum.EntityOutputList, ParameterType.Output, 'basics.workflow.action.customEditor.outputSaveObject', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, EntityDataActionParamsEnum.EntityOutputInfo, ParameterType.Output, 'basics.workflow.action.customEditor.outputInfoMessage', {} as ICodemirrorEditorOptions);
	}
}