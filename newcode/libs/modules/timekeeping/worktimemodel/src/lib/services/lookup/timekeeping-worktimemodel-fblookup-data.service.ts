/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILookupContext, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkTimeModelEntity } from '../../model/entities/work-time-model-entity.interface';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingWorktimemodelFblookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IWorkTimeModelEntity,TEntity> {
	public constructor() {
		super({httpRead: { route: 'timekeeping/worktimemodel/', endPointRead: 'fblookup' }}, {
			uuid: '5700b79cdc7c46d4842d54f080436abd',
			displayMember: 'DescriptionInfo',
			valueMember: 'Id',
			clientSideFilter: {
				execute(item: IWorkTimeModelEntity, context: ILookupContext<IWorkTimeModelEntity, TEntity>): boolean {
					return item.IsLive;
				}
			}
		});
	}
}