/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityIdentification} from '@libs/platform/common';

/**
 * Workflow action default properties
 */
export interface IWorkflowActionDefinition extends IEntityIdentification {
	ActionId: string,
	Description: string,
	Version: string,
	Input: string[],
	Output: string[],
	ActionType: number,
	IsLongRunning: boolean,
	Namespace: string
}
