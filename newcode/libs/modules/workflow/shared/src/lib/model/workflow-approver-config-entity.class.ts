/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

/**
 * Workflow approver config default properties
 */
export interface IWorkflowApproverConfigEntity extends IEntityIdentification {
	Id: number,
	TemplateFk: number,
	ClerkRoleFk: number,
	EvaluationLevel: number,
	TimeToApprove: number,
	ClassifiedNum: number,
	ClassifiedDate: Date,
	ClassifiedAmount: number,
	ClassifiedText: string,
	Formular: string,
	InsertedAt: Date,
	InsertedBy: number,
	UpdatedAt: number,
	UpdatedBy: number,
	Version: number,
	IsMail: number,
	NeedComment4Reject: boolean,
	NeedComment4Approve: boolean,
	AllowReject2Level: boolean,
	IsSendMailToClerk: boolean
}
