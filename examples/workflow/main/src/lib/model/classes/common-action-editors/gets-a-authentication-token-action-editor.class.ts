/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { CodemirrorLanguageModes, FieldType } from '@libs/ui/common';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { GetAuthenticationTokenActionEditorParams } from '../../enum/actions/gets-a-authentication-token-action-params.enum';

/**
 * Configuration class for Get a Authentication Token Action editor
 */

export class GetAuthenticationTokenActionEditor extends CommonColumnEditor {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		const editorOptionsScript = {
			enableLineNumbers: true,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableBorder: true
		};
		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.ActiveDirectoryTenant, ParameterType.Input, 'ActiveDirectoryTenant', editorOptions);
		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.ActiveDirectoryClientAppId, ParameterType.Input, 'ActiveDirectoryClientAppId', editorOptions);
		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.ActiveDirectoryResource, ParameterType.Input, 'ActiveDirectoryResource', editorOptions);
		this.createFieldByForm(this.getViewModeConfig([
			{
				formRowId: GetAuthenticationTokenActionEditorParams.UserName,
				formGroupId: ParameterType.Input,
				standardViewFieldType: StandardViewFieldType.DomainControl,

				row: {
					id: GetAuthenticationTokenActionEditorParams.UserName,
					type: FieldType.Script,
					model: this.getModel(GetAuthenticationTokenActionEditorParams.UserName, ParameterType.Input),
					label: {key: 'UserName'},
					groupId: ParameterType.Input,
					editorOptions: editorOptionsScript
				},
				expertViewFormConfig: {
					rows: [{
						type: FieldType.Script,
						editorOptions: editorOptionsScript,
						id: GetAuthenticationTokenActionEditorParams.ClientSecret,
						groupId: ParameterType.Input,
						label: {key: 'ClientSecret'},
						model: this.getModel(GetAuthenticationTokenActionEditorParams.ClientSecret, ParameterType.Input)
					}]
				}

			},
			{
				formRowId: GetAuthenticationTokenActionEditorParams.UserPassword,
				formGroupId: ParameterType.Input,
				standardViewFieldType: StandardViewFieldType.DomainControl,
				row: {
					id: GetAuthenticationTokenActionEditorParams.UserPassword,
					label: {key: 'UserPassword'},
					type: FieldType.Script,
					model: this.getModel(GetAuthenticationTokenActionEditorParams.UserPassword, ParameterType.Input),
					editorOptions: editorOptionsScript
				},
				expertViewFormConfig: {
					//needs to be empty
					rows: []
				}
			}
		]),);
		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.AccessTokenType, ParameterType.Output, 'AccessTokenType', editorOptions);
		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.AccessToken, ParameterType.Output, 'AccessToken', editorOptions);
		this.createField(FieldType.Comment, GetAuthenticationTokenActionEditorParams.AuthenticationResult, ParameterType.Output, 'AuthenticationResult', editorOptions);
	}
}