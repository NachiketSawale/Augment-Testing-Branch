/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';
import { WorkflowTemplate } from './workflow-template.interface';
import { IWorkflowAction } from './workflow-action.interface';

/**
 * Workflow template version properties
 */
export interface IWorkflowTemplateVersion extends IEntityIdentification {
	IsReadOnly: boolean,
	IncludedScripts: [],
	TemplateVersion: number,
	Status: number,
	Comment: string,
	Helptext: string,
	Context: string,
	WorkflowAction: string | IWorkflowAction,
	InsertedAt: Date,
	InsertedBy: number,
	StatusImage: string,
	UpdatedAt: Date,
	UpdatedBy: number,
	Version: number,
	WorkflowTemplateId: number,
	ValidFrom: Date,
	ValidTo: Date,
	RevisionDate: Date,
	RevisionClerkId: number,
	Lifetime: number,
	WorkflowInstanceEntities: [],
	ClerkEntity: null,
	WorkflowTemplates: WorkflowTemplate[]
}