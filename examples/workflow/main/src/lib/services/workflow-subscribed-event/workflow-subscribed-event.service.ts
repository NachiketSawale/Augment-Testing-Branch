/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { WorkflowSubscribedEventLookupItem, WorkflowTemplateComplete } from '@libs/workflow/shared';
import { IWorkflowSubscribedEvent, WorkflowTemplate } from '@libs/workflow/interfaces';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsWorkflowTemplateDataService } from '../../services/basics-workflow-template-data.service';
import { uniqBy } from 'lodash';
import { WorkflowEventService } from '../workflow-event/workflow-event.service';


/**
 * Data service used for SubscribedEvent
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowSubscribedEventService extends DataServiceFlatLeaf<IWorkflowSubscribedEvent, WorkflowTemplate, WorkflowTemplateComplete> {

	private readonly templateDataService: BasicsWorkflowTemplateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly workflowEventService: WorkflowEventService = inject(WorkflowEventService);
	private readonly httpService = inject(PlatformHttpService);

	public constructor() {
		const options: IDataServiceOptions<IWorkflowSubscribedEvent> = {
			apiUrl: '',
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowSubscribedEvent, WorkflowTemplate, WorkflowTemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SubscribedEvents',
				parent: inject(BasicsWorkflowTemplateDataService)
			},
			readInfo: {
				endPoint: '',
				usePost: true
			},
			provider: {
				load(): Promise<IWorkflowSubscribedEvent[]> {
					return self.loadData();
				},
				create(): Promise<IWorkflowSubscribedEvent> {
					return self.createData();
				}
			}
		};
		super(options);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self: WorkflowSubscribedEventService = this;
	}

	public loadData(): Promise<IWorkflowSubscribedEvent[]> {
		const selectedTemplateId = this.templateDataService.getSelection()[0]?.Id;
		return this.httpService.get<IWorkflowSubscribedEvent[]>('basics/workflow/v2/template/getSubscribedEventsByTemplateId', { params: { id: selectedTemplateId } });
	}

	public createData(): Promise<IWorkflowSubscribedEvent> {
		const selectedTemplateId = this.templateDataService.getSelection()[0]?.Id;
		return Promise.resolve(this.httpService.post<IWorkflowSubscribedEvent>(`basics/workflow/template/${selectedTemplateId}/subscribedevent`, {}));
	}

	public override collectModificationsForParentUpdate(parentUpdate: WorkflowTemplateComplete) {
		if (this.getModified().some(() => true)) {
			parentUpdate.SubscribedEventsToSave.push(...this.getModified());
		}
		if (this.getDeleted().some(() => true)) {
			parentUpdate.SubscribedEventsToDelete.push(...this.getDeleted());
		}
	}

	public async loadSubscribedEventsForLookup(): Promise<void> {
		const subscribedEventList = await this.workflowEventService.getEvents();
		this._subscribedEvents.push(...subscribedEventList.map((e) => new WorkflowSubscribedEventLookupItem(e.description, e.uuid?.toString())));
		this._subscribedEvents = uniqBy(this._subscribedEvents, 'uuid'); //TODO: remove when workflow-main.module constructor is not triggered twice anymore
	}

	private _subscribedEvents: WorkflowSubscribedEventLookupItem[] = [];

	public get subscribedEventsForLookup() {
		return this._subscribedEvents;
	}
}