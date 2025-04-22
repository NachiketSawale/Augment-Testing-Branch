/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { DebugContext, IActionParam } from '@libs/workflow/interfaces';


/**
 * These injection tokens are used to supply input details and context info for each client action.
 */
export const WORKFLOW_ACTION_INPUT_TOKEN = new InjectionToken<IActionParam[]>('input-data');
export const WORKFLOW_ACTION_CONTEXT_TOKEN = new InjectionToken<DebugContext>('current-context');
