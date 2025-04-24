/*
 * Copyright(c) RIB Software GmbH
 */

import { TValue, WorkflowClientUuid } from '@libs/workflow/interfaces';

/**
 * Registered workflow events.
 */
export type WorkflowEvent = { uuid: WorkflowClientUuid, description: string };

/**
 * Configuration required to trigger workflow by event.
 */
export type WorkflowEventData = { entityId: number, jsonContext: string, [key: string]: TValue };