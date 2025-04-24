/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEntityContext } from '@libs/platform/common';
import { IActivityEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})
export class SchedulingActivityFullLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'scheduling/main/activity/', endPointRead: 'tree',usePostForRead:false },
			filterParam: true
		}, {
			uuid: 'aefeddae8d814189815420abba2f0a3e',
			valueMember: 'Id',
			displayMember: 'Code',
			showGrid: true,
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					},
					{
						id: 'Schedule',
						model: 'Schedule.Code',
						type: FieldType.Description,
						label: {text: 'Description', key: 'scheduling.schedule.entitySchedule'},
						sortable: true,
						visible: true
					}
				]
			}
		});
	}

	protected override prepareListFilter(context?: IEntityContext<IActivityEntity>): string | object | undefined {
		return 'scheduleId=' + context?.entity?.ScheduleFk;
	}

}