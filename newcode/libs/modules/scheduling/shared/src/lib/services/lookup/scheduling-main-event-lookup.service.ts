/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEventEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedEventTypeLookupService } from '@libs/basics/shared';
import { IEntityContext } from '@libs/platform/common';
import { SchedulingActivityFullLookupService } from './scheduling-activity-full-lookup.service';

/**
 * Event lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainEventLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEventEntity, TEntity> {
	private eventId: number | null | undefined = 0;

	public constructor() {
		const endpoint = {
			httpRead: { route: 'scheduling/main/event/', endPointRead: 'list' },
			filterParam: true,
		};
		const config: ILookupConfig<IEventEntity> = {
			uuid: 'f3fb42ca164a45b88ac07b09c8a1e39a',
			valueMember: 'Id',
			displayMember: 'Description',
			showGrid: true,
			selectableCallback: (item) => item.Id != this.eventId,
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true
					},
					{
						id: 'Date',
						model: 'Date',
						type: FieldType.Date,
						label: {text: 'Date', key: 'cloud.common.entityDate'},
						sortable: true
					},
					{
						id: 'EventTypeFk',
						model: 'EventTypeFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedEventTypeLookupService
						}),
						label: {text: 'Event Type', key: 'scheduling.template.eventType'},
						sortable: true
					},
					{
						id: 'ActivityFk',
						model: 'ActivityFk',
						label: {text: 'Activity', key: 'scheduling.main.entityActivity'},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: SchedulingActivityFullLookupService
						}),
						sortable: true
					}
					],
			}
		};
		super(endpoint, config);
	}

	protected override prepareListFilter(context?: IEntityContext<IEventEntity>): string | object | undefined {
		this.eventId = context?.entity?.Id;
		return 'mainItemId='+ context?.entity?.ActivityFk;
	}
}