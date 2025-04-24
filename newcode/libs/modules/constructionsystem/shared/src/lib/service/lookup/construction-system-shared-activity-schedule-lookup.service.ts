/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IScriptCommonLookupEntity } from '../../model/entities/script-common-lookup-entity.interface';

// todo-allen: Not sure if need to invoke the following lookup service to get the lookup data.
//  SchedulingScheduleLookup, SchedulingActivityLookupWithoutEndpoint
@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedActivityScheduleLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IScriptCommonLookupEntity, TEntity> {
	private activityItems: IScriptCommonLookupEntity[] = [];
	private scheduleItems: IScriptCommonLookupEntity[] = [];

	public constructor() {
		super([], {
			uuid: 'a07b04dade744287ae8d65d19c9865b0',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
		});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IScriptCommonLookupEntity> {
		return new Observable((observer) => {
			const foundActivityItem = this.activityItems.find((item) => {
				return id.id === this.identify(item).id;
			});
			if (foundActivityItem?.ScheduleFk) {
				const foundScheduleItem = this.scheduleItems.find((item) => {
					return foundActivityItem.ScheduleFk === this.identify(item).id;
				});
				observer.next(foundScheduleItem);
			}
			observer.complete();
		});
	}

	public setActivityScheduleItems(activityItems?: IScriptCommonLookupEntity[] | null, scheduleItems?: IScriptCommonLookupEntity[] | null) {
		this.activityItems = activityItems ?? [];
		this.scheduleItems = scheduleItems ?? [];
	}
}
