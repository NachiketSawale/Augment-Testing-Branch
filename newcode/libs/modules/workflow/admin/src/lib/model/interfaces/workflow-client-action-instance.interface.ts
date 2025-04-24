/*
 * Copyright(c) RIB Software GmbH
 */
import { ClerkEntity } from '@libs/basics/shared';
export interface IWorkflowClientActionInstanceInterface {
	Id: number,
	IdInTemplate: number,
	WorkflowInstanceId: number,
	Status?: number,
	PriorityId?: number,
	Started: Date,
	Description: string,
	Comment: string,
	ActionId: number,
	Context: string,
	IsRunning?: boolean,
	OwnerId?: number,
	ProgressById?: number,
	Lifetime: number,
	MaxEndtime?: Date,
	Endtime?: Date,
	ActionName: string,
	EntityInfo: string, //TODO create EntityInfo interface
	Clerk: ClerkEntity,
	EntityDescription: string,
	TemplateDescription: string,
	Duration?: string
}