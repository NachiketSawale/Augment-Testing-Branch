/*
 * Copyright(c) RIB Software GmbH
 */


import { ClientActionRows, IActionParam } from '@libs/workflow/interfaces';

/**
 * This interface is used to provide input information from client action service to client action specific component
 * and get the data from client action component back to the service.
 */
export interface IClientActionResult {
	input:IActionParam[],
	output?:ClientActionRows
}
