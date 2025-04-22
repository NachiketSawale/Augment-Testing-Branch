/*
 * Copyright(c) RIB Software GmbH
 */

import { ActionValidationResult } from '../classes/action-validation-result.class';

/**
 * Vaildation result for all actions in a template.
 */
export interface ITemplateValidationResult {
	[actionId: number]: ActionValidationResult
}