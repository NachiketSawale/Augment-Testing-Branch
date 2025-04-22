/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';


/**
 * Interface for Approver Entity.
 */
export interface IWorkflowApprover extends IEntityIdentification {
	IsApproved: boolean;
	Comment: string;
	EvaluationLevel: number;
	EvaluatedOn: Date;
	DueDate: Date;
	ClerkRole: string;
	Clerk: string;
	ClerkFk: number;
	ClerkRoleFk: number;
}
