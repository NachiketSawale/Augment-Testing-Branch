/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IEventTypeSlotEntity } from '../model/entities/event-type-slot-entity.interface';
import { EventTypeSlotComplete } from '../model/event-type-slot-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ConfigurationEventTypeSlotDataService extends DataServiceFlatRoot<IEventTypeSlotEntity, EventTypeSlotComplete> {

	public constructor() {
		const options: IDataServiceOptions<IEventTypeSlotEntity> = {
			apiUrl: 'productionplanning/configuration/eventtypeslot',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
				//TODO: prepareParam: ident => ({FurtherFilters: [{'Token':'ColumnSelection', Value: 'datetime'}]})
			},
			roleInfo: <IDataServiceRoleOptions<IEventTypeSlotEntity>>{
				role: ServiceRole.Root,
				itemName: 'EventTypeSlot',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IEventTypeSlotEntity | null): EventTypeSlotComplete {
		const complete = new EventTypeSlotComplete();
		if (modified !== null) {
			complete.EventTypeSlot = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EventTypeSlotComplete): IEventTypeSlotEntity[] {
		if (complete.EventTypeSlot) {
			return [complete.EventTypeSlot];
		}
		return [];
	}
}












