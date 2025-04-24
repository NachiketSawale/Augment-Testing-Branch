/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { createLookup, FieldType, FormRow, ICodemirrorEditorOptions } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { GetTextAssemblyActionEditorParams } from '../../enum/actions/get-text-assembly-action-editor-params.enumm';
import { BasicsSharedTextModuleContextSimpleLookupService } from '@libs/basics/shared';
import { CrbLanguageLookupService } from '@libs/boq/main';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';

export class GetTextAssemblyActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		//Input
		this.createFieldByForm(this.textModuleField());
		this.createLookupEditorMode(GetTextAssemblyActionEditorParams.DataLanguage, ParameterType.Input, 'basics.workflow.action.customEditor.replaceVariable.language', CrbLanguageLookupService);
		this.createField(FieldType.Text, GetTextAssemblyActionEditorParams.MainEntityQueryId, ParameterType.Input, 'basics.workflow.action.customEditor.mainEntityQueryId', {} as ICodemirrorEditorOptions);
		//Output
		this.createField(FieldType.Text, GetTextAssemblyActionEditorParams.Result, ParameterType.Output, 'basics.workflow.action.customEditor.replaceVariable.result', {} as ICodemirrorEditorOptions);

	}

	public textModuleField(): FormRow<IWorkflowAction> {
		return this.getViewModeConfig([{
			formRowId: GetTextAssemblyActionEditorParams.TextModuleId,
			standardViewFieldType: StandardViewFieldType.DomainControl,
			formGroupId: ParameterType.Input,
			row: {
				type: FieldType.Composite,
				id: `row_${ParameterType.Input}_${FieldType.Composite}`,
				model: this.getModel(GetTextAssemblyActionEditorParams.TextModuleId, ParameterType.Input),
				groupId: ParameterType.Input,
				label: {key: 'basics.workflow.action.customEditor.replaceVariable.textModule'},
				composite: [
					{
						type: FieldType.Lookup,
						id: `row_${ParameterType.Input}_${GetTextAssemblyActionEditorParams.TextModuleId}`,
						model: this.getModel(GetTextAssemblyActionEditorParams.TextModuleId, ParameterType.Input),
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedTextModuleContextSimpleLookupService,
						}),
					},
					{
						type: FieldType.Description,
						id: `row_${ParameterType.Input}1_${GetTextAssemblyActionEditorParams.TextModuleId}1`,
						model: this.getModel(GetTextAssemblyActionEditorParams.TextModuleId, ParameterType.Input),
						readonly: true
					}
				],
			}
		}]);

	}
}