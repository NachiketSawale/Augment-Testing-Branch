/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { CodemirrorLanguageModes, createLookup, FieldType, ILookupEvent } from '@libs/ui/common';
import { GetCharacteristicActionParams } from '../../enum/actions/get-charactaristic-action-editor-params.enum';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { CharacteristicSectionEntity, WorkflowSectionCharacteristicLookup } from '../../../services/workflow-lookup/action-editors/workflow-characteristic-section-data-lookup.service';
import { WorkflowCharacteristicCodeLookupService } from '../../../services/workflow-lookup/action-editors/workflow-characteristic-code-lookup.service';

/**
 * Configuration class for Get Characteristic action editor
 */

export class GetCharacteristicActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};
		const codeLookupService = this.injector.get(WorkflowCharacteristicCodeLookupService);
		const sectionParamRef = this.getActionObj(GetCharacteristicActionParams.SectionId, ParameterType.Input);
		this.createField(FieldType.Script, GetCharacteristicActionParams.ObjectId, ParameterType.Input, 'basics.workflow.action.customEditor.objectId', editorOptions);
		this.createFieldByForm(this.getViewModeConfig([
			{
				formRowId: GetCharacteristicActionParams.SectionId,
				formGroupId: ParameterType.Input,
				standardViewFieldType: StandardViewFieldType.DomainControl,
				row: {
					id: GetCharacteristicActionParams.SectionId,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: WorkflowSectionCharacteristicLookup,
						events: [
							{
								name: 'onSelectedItemChanged', handler(e: ILookupEvent<CharacteristicSectionEntity, IWorkflowAction>) {
									//Returning if value hasn't changed
									if (sectionParamRef.value == (e.selectedItem as CharacteristicSectionEntity).Id.toString()) {
										return;
									}
									codeLookupService.resetLookup(e.context);
								},
							}
						],
					}),
					model: this.getModel(GetCharacteristicActionParams.SectionId, ParameterType.Input),
					label: {key: 'basics.workflow.action.customEditor.sectionId'},
					groupId: ParameterType.Input,
				},

			},
			{
				formRowId: GetCharacteristicActionParams.Code,
				formGroupId: ParameterType.Input,
				standardViewFieldType: StandardViewFieldType.DomainControl,
				row: {
					id: GetCharacteristicActionParams.Code,
					label: {key: 'basics.workflow.action.customEditor.code'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: WorkflowCharacteristicCodeLookupService
					}),
					model: this.getModel(GetCharacteristicActionParams.Code, ParameterType.Input)
				},
				expertViewFormConfig: {
					rows: [{
						type: FieldType.Script,
						editorOptions,
						id: GetCharacteristicActionParams.Code,
						groupId: ParameterType.Input,
						label: {key: 'basics.workflow.action.customEditor.code'},
						model: this.getModel(GetCharacteristicActionParams.Code, ParameterType.Input)
					}]
				}
			}
		]),);
		this.createField(FieldType.Script, GetCharacteristicActionParams.Characteristic, ParameterType.Output, 'basics.workflow.action.customEditor.characteristic', editorOptions);
	}
}