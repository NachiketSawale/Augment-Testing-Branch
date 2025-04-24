/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IEventType2ResTypeEntity } from '../model/entities/event-type-2res-type-entity.interface';
import { IEventTypeEntity } from '../model/entities/event-type-entity.interface';
import { ConfigurationEventTypeDataService } from './configuration-event-type-data.service';
import { EventTypeComplete } from '../model/event-type-complete.class';


@Injectable({
	providedIn: 'root'
})
export class ConfigurationEventtype2restypeDataService extends DataServiceFlatLeaf<IEventType2ResTypeEntity, IEventTypeEntity, EventTypeComplete> {

	public constructor(private eventTypeService: ConfigurationEventTypeDataService) {
		const options: IDataServiceOptions<IEventType2ResTypeEntity> = {
			apiUrl: 'productionplanning/configuration/eventtype2restype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => ({eventTypeId: ident.pKey1})
			},
			createInfo: <IDataServiceEndPointOptions>{
				usePost: true,
				prepareParam: ident => ({Id: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IEventType2ResTypeEntity, IEventTypeEntity, EventTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EventType2ResType',
				parent: eventTypeService,
			},
		};

		super(options);
	}

}








