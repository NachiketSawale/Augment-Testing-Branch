/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowActionInstanceCommon } from './workflow-action-instance-common.interface';

export interface IWorkflowActionInstanceHistory extends IWorkflowActionInstanceCommon {
	User: string;
	Action: string;
	UserId?: number;
	ProgressedById?: number;
	ProgressedBy: string;
	ExecuteSequence: number;
	Duration: string;
	Description: string;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Userdefined4: string;
	Userdefined5: string;
}