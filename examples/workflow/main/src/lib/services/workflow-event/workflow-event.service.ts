/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { IWorkflowInstance, WorkflowClientUuid } from '@libs/workflow/interfaces';
import { find, get, uniqBy } from 'lodash';
import { WorkflowInstanceService } from '../workflow-instance/workflow-instance.service';
import { WorkflowEvent, WorkflowEventData } from '../../model/types/workflow-event.type';

/**
 * Used to register and start workflow events.
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowEventService {

	public events: WorkflowEvent[] = [];
	private readonly workflowInstanceService = inject(WorkflowInstanceService);
	private clientEventExecutionMap: Record<WorkflowClientUuid, (data: WorkflowEventData) => Promise<IWorkflowInstance | undefined>> = {};
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Registers an event which can be used to start a workflow.
	 * @param uuid
	 * @param description
	 * @param entityIdPropertyPath
	 * @param contextPropertyPath
	 */
	public registerEvent(uuid: WorkflowClientUuid, description: string, entityIdPropertyPath: string, contextPropertyPath: string) {
		this.events.push({ uuid: uuid, description: description });

		const startWorkflow = this.workflowInstanceService.startWorkflowByEvent;

		const eventExecutionFn = (data: WorkflowEventData): Promise<IWorkflowInstance | undefined> => {
			let id = null;
			let json = null;
			if (data) {
				id = get(data, entityIdPropertyPath, data.entityId) as IIdentificationData | number | null;
				json = get(data, contextPropertyPath, data.jsonContext) as string | null;
			}

			return startWorkflow(uuid, id, json, false);
		};
		this.clientEventExecutionMap[uuid] = eventExecutionFn;
	}

	/**
	 * Retrieves all events that have been registered from both the server and client side.
	 * @returns
	 */
	public async getEvents(): Promise<WorkflowEvent[]> {
		const response: WorkflowEvent[] = await this.httpService.get('basics/workflow/events');
		//TODO:extendObject
		const eventsList = this.events.concat(response);
		return uniqBy(eventsList, 'uuid');
	}

	/**
	 * Retrieves a specific event based on it's uuid.
	 * @param uuid
	 * @returns
	 */
	public getEvent(uuid: WorkflowClientUuid): WorkflowEvent | undefined {
		return find(this.events, { uuid: uuid });
	}

	/**
	 * Starts a pre-registered workflow event based on the passed uuid and configuration data.
	 * @param uuid Uuid of the event.
	 * @param data Data used by the event execution function.
	 */
	public startWorkflowByEvent(uuid: WorkflowClientUuid, data: WorkflowEventData): Promise<IWorkflowInstance | undefined> {
		return this.clientEventExecutionMap[uuid](data);
	}
}