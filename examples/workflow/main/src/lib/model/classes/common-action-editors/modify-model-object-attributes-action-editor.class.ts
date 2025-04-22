/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, createLookup, FieldType, ICodemirrorEditorOptions, IGridConfiguration } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { ModelObjectAttributesLookup } from '../../../services/workflow-lookup/action-editors/workflow-model-object-attributes-lookup.service';
import { ModifyModelObjectAttributesActionEditorParams } from '../../enum/actions/modify-model-object-attributes-action-editor-params.enum';

/**
 * Configuration class for Include Model Object Attributes action editor.
 */
export class ModifyModelObjectAttributesActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		const codeMirror: ICodemirrorEditorOptions ={
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableLineNumbers: false,
			enableBorder: true
		};
		this.createField(FieldType.Comment, ModifyModelObjectAttributesActionEditorParams.Objects, ParameterType.Input, 'basics.workflow.action.customEditor.modelObjectsAttribute.modelObjects', codeMirror);
		this.createField(FieldType.Grid, ModifyModelObjectAttributesActionEditorParams.PropertyChanges, ParameterType.Input, 'basics.workflow.action.customEditor.modelObjectsAttribute.values',{} as ICodemirrorEditorOptions, undefined, this.config);
		this.createField(FieldType.Comment, ModifyModelObjectAttributesActionEditorParams.Objects, ParameterType.Output, 'basics.workflow.action.customEditor.modelObjectsAttribute.modelObjects', codeMirror);
	}

	private config: IGridConfiguration<{ id: string | number }> = {
		uuid: '5f934cf460444b4bb7b8ad5a90715a89',
		columns: [{
			id: 'PropertyKeyFk',
			model: 'PropertyKeyFk',
			type: FieldType.Lookup,
			label: {text: 'Attribute', key: 'Attribute'},
			lookupOptions: createLookup({
				dataServiceToken: ModelObjectAttributesLookup,
			}),
			sortable: true,
			visible: true,
			readonly: false
		},{
			id: 'Delete',
			model: 'Delete',
			type: FieldType.Boolean,
			label: {text: 'Delete Values', key: 'Delete'},
			sortable: true,
			visible: true,
			readonly: false
		},{
			id: 'Delete',
			model: 'PropertyValueText',
			type: FieldType.Description,
			label: {text: 'Value', key: 'Value'},
			sortable: true,
			visible: true,
			readonly: false
		}],
		items: [],
		skipPermissionCheck: true,
		idProperty: 'id'
	};
}