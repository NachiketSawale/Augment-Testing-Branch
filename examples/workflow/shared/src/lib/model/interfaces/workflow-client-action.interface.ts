/*
 * Copyright(c) RIB Software GmbH
 */
import { Type } from '@angular/core';
import { ICustomWorkflowAction } from './workflow-custom-action.interface';
import { TValue, WorkflowActionType } from '@libs/workflow/interfaces';



/**
 * IClientAction interface that includes base properties common for all client-actions as well as
 * action specific dynamic properties
 */
export interface IClientAction<TBody> {

	/**
	 * Action Id of client action.
	 */
	Id: string;

	/**
	 * Input paramaters of client action.
	 */
	Input: string[];

	/**
	 * Output parameter of client action.
	 */
	Output: string[];

	/**
	 * Description of the action.
	 */
	Description: string;

	/**
	 * Type of workflow action.
	 */
	ActionType: WorkflowActionType;

	/**
	 * group action based on Namespace.
	 */
	Namespace: string

	/**
	 * component name of the client action.
	 */
	Component?: Type<TBody>;

	//Todo: to be included in next client action implementation.
	execute?: (task: ICustomWorkflowAction) => Promise<string>; //TODO: Add execute with client action implementation.

	[key: string]: TValue | undefined;
}