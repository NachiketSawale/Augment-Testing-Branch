/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonColumnEditor } from '../action-editor-helpers/common-column-editor.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions, ISelectItem } from '@libs/ui/common';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { SendTeamsMessageActionEditorParams } from '../../enum/actions/send-teams-message-action-editor-params.enum';
import { SendTeamsMessageParamsView } from '../../enum/send-teams-message-parameter-view.enum';

export class SendTeamsMessageActionEditor extends CommonColumnEditor {
	private readonly editorOptions: ICodemirrorEditorOptions = {
		enableLineNumbers: true,
		languageMode: CodemirrorLanguageModes.JavaScript,
		multiline: true,
		readOnly: false,
		enableBorder: true
	};

	public readonly radioSelectOptions: ISelectItem<number>[] =
		[{
			id: 1,
			displayName: 'basics.workflow.action.customEditor.teams.sendToAUser'
		}, {
			id: 2,
			displayName: 'basics.workflow.action.customEditor.teams.sendToAChannel'
		}];

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);


		//Input
		this.createField(FieldType.Radio, SendTeamsMessageActionEditorParams.To, ParameterType.Input, 'basics.workflow.action.customEditor.teams.to', this.editorOptions, undefined, undefined, false, this.radioSelectOptions);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.Message, ParameterType.Input, 'basics.workflow.action.customEditor.teams.message', this.editorOptions);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.FileArchiveId, ParameterType.Input, 'basics.workflow.action.customEditor.teams.fileArchiveId', this.editorOptions);
		this.createField(FieldType.Boolean, SendTeamsMessageActionEditorParams.HTML, ParameterType.Input, 'basics.workflow.action.customEditor.teams.html', {} as ICodemirrorEditorOptions);
		const radioParam = workflowAction.input.find(actionParam => actionParam.key === SendTeamsMessageActionEditorParams.To);
		this.switchUserTeam(radioParam ? radioParam.value as unknown as number : 0);

		this.radioChange$.subscribe(value => {
			if (value.newValue) {
				this.switchUserTeam(value.newValue as number);
			}
		});

		//Output
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.ResultCode, ParameterType.Output, 'basics.workflow.action.customEditor.teams.resultCode', this.editorOptions);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.ResultMessage, ParameterType.Output, 'basics.workflow.action.customEditor.teams.resultMessage', this.editorOptions);
	}

	private sendToUser() {
		this.removeRowFromConfig(`row_${ParameterType.Input}_${SendTeamsMessageActionEditorParams.TeamsId}`);
		this.removeRowFromConfig(`row_${ParameterType.Input}_${SendTeamsMessageActionEditorParams.TeamsName}`);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.UserId, ParameterType.Input, 'basics.workflow.action.customEditor.teams.userId', this.editorOptions);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.UserPrincipalName, ParameterType.Input, 'basics.workflow.action.customEditor.teams.userPrincipalName', this.editorOptions);
	}

	private sendToTeam() {
		this.removeRowFromConfig(`row_${ParameterType.Input}_${SendTeamsMessageActionEditorParams.UserId}`);
		this.removeRowFromConfig(`row_${ParameterType.Input}_${SendTeamsMessageActionEditorParams.UserPrincipalName}`);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.TeamsId, ParameterType.Input, 'basics.workflow.action.customEditor.teams.teamsId', this.editorOptions);
		this.createField(FieldType.Script, SendTeamsMessageActionEditorParams.TeamsName, ParameterType.Input, 'basics.workflow.action.customEditor.teams.teamsName', this.editorOptions);
	}

	private switchUserTeam(radioState: number) {
		switch (radioState) {
			case SendTeamsMessageParamsView.SendToUser:
				this.sendToUser();
				break;
			case SendTeamsMessageParamsView.SendToChannel:
				this.sendToTeam();
				break;
		}
		this.getFormConfig();
	}
}