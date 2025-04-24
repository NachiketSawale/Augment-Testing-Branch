/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { SyncMaterialCatalogFromYwtoActionEditorParams } from '../../enum/actions/sync-material-catalog-from-ywto-action-editor-params.enum';

/**
 * Configuration class for Sync Material Catalog From YTWO action editor.
 */
export class SyncMaterialCatalogFromYwtoActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, SyncMaterialCatalogFromYwtoActionEditorParams.MaterialCatalogCodes, ParameterType.Input, 'basics.workflow.action.customEditor.materialCatalogCodes', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SyncMaterialCatalogFromYwtoActionEditorParams.Language, ParameterType.Input, 'basics.workflow.action.customEditor.language', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SyncMaterialCatalogFromYwtoActionEditorParams.UpdatedMaterialCatalogIds, ParameterType.Output, 'basics.workflow.action.customEditor.updatedMaterialCatalogIds', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SyncMaterialCatalogFromYwtoActionEditorParams.ErrorMessage, ParameterType.Output, 'basics.workflow.action.customEditor.errorMessage', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SyncMaterialCatalogFromYwtoActionEditorParams.WarningMessage, ParameterType.Output, 'basics.workflow.action.customEditor.succeeded', {} as ICodemirrorEditorOptions);
	}
}