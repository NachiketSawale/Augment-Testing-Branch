/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowActionInstanceCommon } from './workflow-action-instance-common.interface';

/**
 * Workflow action instance default properties for task module.
 */
export interface IWorkflowActionInstanceTask extends IWorkflowActionInstanceCommon {
	ISCURRENTOWNERPROXY: boolean;
	ISTASKAVAILABLEFORPROXY: boolean;
	ISTASKOWNERABSENT: boolean;
	IdInTemplate: number;
	Status?: number;
	PriorityId?: number;
	Input: string;
	Output: string;
	Description: string;
	TemplateDescription: string;
	Transitions: string;
	OwnerId?: number;
	ProgressById?: number;
	Lifetime: number;
	ClerkFirstName: string;
	ClerkFamilyName: string;
	Clerk: string;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	UserDefined4: string;
	UserDefined5: string;
	OwnerName: string;
	OwnerDescription: string;
	InstanceContext: string;
	ExecuteCondition: string;
	FrmUserIssuerFk?: number;
	FrmUserProgressbyFk?: number;
	BusinesspartnerId?: number;
	BusinesspartnerName1: string;
	BusinesspartnerName2: string;
	BusinesspartnerName3: string;
	BusinesspartnerName4: string;
}