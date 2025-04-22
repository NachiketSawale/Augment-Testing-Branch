/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { WorkflowSubscribedEventService } from '../workflow-subscribed-event/workflow-subscribed-event.service';
import { WorkflowSubscribedEventLookupItem } from '@libs/workflow/shared';

/**
 * Workflow lookup for workflow subscribed event column.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowSubscribedEventLookup<TEntity extends object> extends UiCommonLookupItemsDataService<WorkflowSubscribedEventLookupItem, TEntity> {

	/**
	 * Default constructor to initialize the workflow subscribed event lookup service.
	 */
	public constructor(workflowSubscribedEventService: WorkflowSubscribedEventService) {
		const config: ILookupConfig<WorkflowSubscribedEventLookupItem> = {
			uuid: '86a2e4b8a4854586a049c2182d2d46a3',
			valueMember: 'uuid',
			displayMember: 'description',
			idProperty: 'uuid',
			showClearButton: true,
			showDialog: true,
			gridConfig: {
				idProperty: 'uuid',
				columns: [
					{id: 'description', model: 'description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true},
					{id: 'uuid', model: 'uuid', type: FieldType.Description, label: {text: 'Uuid'}, sortable: true, visible: true, readonly: true}
				]
			}
			//TODO: initial search, implement selection change in lookup
		};
		super(workflowSubscribedEventService.subscribedEventsForLookup, config);
	}
}