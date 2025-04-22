/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes, FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ActionEditorBase } from './action-editor-base.class';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { PortalReviewBidderInvitationEmailActionEditorParams } from '../../enum/actions/portal-review-bidder-invitation-email-action-params.enum';

/**
 * Configuration class for portal review bidder invitation email action editor.
 */
export class PortalReviewBidderInvitationEmailActionEditor extends ActionEditorBase {


	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		this.createField(FieldType.Comment, PortalReviewBidderInvitationEmailActionEditorParams.Recipient, ParameterType.Input, 'basics.workflow.action.customEditor.portal.recipient', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, PortalReviewBidderInvitationEmailActionEditorParams.Subject, ParameterType.Input, 'basics.workflow.action.customEditor.mail.subject', {} as ICodemirrorEditorOptions);
		//ToDo CodemirrorLanguageModes JavaScript not suitable for multiline Text Field
		this.createField(FieldType.Script, PortalReviewBidderInvitationEmailActionEditorParams.Body, ParameterType.Input, 'basics.workflow.action.customEditor.mail.body', {
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: true,
			readOnly: false,
			enableLineNumbers: true,
			enableBorder: true
		});
		this.createField(FieldType.Boolean, PortalReviewBidderInvitationEmailActionEditorParams.IsPopUp, ParameterType.Input, 'basics.workflow.action.customEditor.isPopUp', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, PortalReviewBidderInvitationEmailActionEditorParams.ResultCode, ParameterType.Output, 'basics.workflow.action.customEditor.portal.resultCode', {} as ICodemirrorEditorOptions);
	}
}