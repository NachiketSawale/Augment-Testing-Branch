/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowTemplateVersion } from './workflow-template-version.interface';
import { WorkflowInstanceStatus } from '../enums/workflow-instance-status.enum';
import { IWorkflowActionInstance } from './workflow-action-instance.interface';

export interface IWorkflowInstance {
	Id: number;
	EntityId?: number;
	ModuleId?: number;
	TemplateId: number;
	Context: string;
	Description: string;
	InsertedAt: Date;
	Status?: WorkflowInstanceStatus;
	StatusName?: string;
	TemplateVersionId: number;
	InsertedBy: number;
	UpdatedAt?: Date;
	UpdatedBy?: number;
	Version: number;
	Started?: Date;
	Purgedate?: Date;
	SearchPattern: string;
	Endtime?: Date;
	Duration: string;
	ClerkId?: number;
	CompanyId?: number;
	CompanyName?: string;
	ProjectId?: number;
	CallingInstanceId?: number;
	ModuleName?: string;
	TemplateVersion: IWorkflowTemplateVersion;
	ErrorMessage?: string;
	Children: Array<IWorkflowInstance>;
	ActionInstances: IWorkflowActionInstance[];
}