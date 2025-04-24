/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, createLookup, FieldType, ICodemirrorEditorOptions, IGridConfiguration } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IncludeModelObjectAttributesActionEditorParams } from '../../enum/actions/include-model-object-attributes-editor-params.enum';
import { ModelObjectAttributesLookup } from '../../../services/workflow-lookup/action-editors/workflow-model-object-attributes-lookup.service';

/**
 * Configuration class for Include Model Object Attributes action editor.
 */
export class IncludeModelObjectAttributesActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		const codeMirror: ICodemirrorEditorOptions ={
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableLineNumbers: false,
			enableBorder: true
		};
		this.createField(FieldType.Comment, IncludeModelObjectAttributesActionEditorParams.FilterChain, ParameterType.Input, 'basics.workflow.action.customEditor.filterChain.inFilterChain', codeMirror);
		this.createField(FieldType.Grid, IncludeModelObjectAttributesActionEditorParams.PropertyKeys, ParameterType.Input, 'Attributes',{} as ICodemirrorEditorOptions, undefined, this.config);
		this.createField(FieldType.Comment, IncludeModelObjectAttributesActionEditorParams.FilterChain, ParameterType.Output, 'basics.workflow.action.customEditor.filterChain.outFilterChain', codeMirror);
	}

	private config: IGridConfiguration<{ id: string | number }> = {
		uuid: '5f934cf460444b4bb7b8ad5a90715a87',
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
			id: 'Alias',
			model: 'Alias',
			type: FieldType.Description,
			label: {text: 'Alias', key: 'Alias'},
			sortable: true,
			visible: true,
			readonly: false
		}],
		items: [],
		skipPermissionCheck: true,
		idProperty: 'id'
	};
}