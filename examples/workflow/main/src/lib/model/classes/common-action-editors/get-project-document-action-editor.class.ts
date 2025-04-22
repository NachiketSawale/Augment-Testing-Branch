/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { GetProjectDocumentActionParamsEnum } from '../../enum/actions/get-project-document-action-editor-params.enum';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';

/**
 * Configuration class for get project document action editor.
 */
export class GetProjectDocumentActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions: ICodemirrorEditorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.ProjectId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.project', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.BusinessPartnerId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.bp', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.CertificateId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.certificate', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.StructureId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.structure', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.MaterialCatalogId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.materialCatalog', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.PackageId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.package', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.RFQId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.rfq', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.QTNId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.qtn', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.CONId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.con', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.PESId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.pes', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.INVId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.inv', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.ScheduleId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.schedule', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.ActivityId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.activity', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.ESTId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.est', editorOptions);
		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.REQId, ParameterType.Input, 'basics.workflow.action.customEditor.projectDocu.req', editorOptions);

		this.createField(FieldType.Comment, GetProjectDocumentActionParamsEnum.DocumentList, ParameterType.Output, 'basics.workflow.action.customEditor.projectDocu.output', editorOptions);
	}
}