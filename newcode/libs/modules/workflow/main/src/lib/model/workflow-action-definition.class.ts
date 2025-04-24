/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowActionDefinition } from '@libs/workflow/interfaces';


/**
 * A class representing workflow action definitions
 */
export class WorkflowActionDefinition implements IWorkflowActionDefinition {
	public Id!: number;
	public ActionId!: string;
	public Description!: string;
	public Version!: string;
	public Input!: string[];
	public Output!: string[];
	public ActionType!: number;
	public IsLongRunning!: boolean;
	public Namespace!: string;
}

