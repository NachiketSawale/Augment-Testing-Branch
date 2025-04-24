/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ConfigurationEventTypeDataService } from './configuration-event-type-data.service';
import { IEngType2PpsEventTypeEntity } from '../model/entities/eng-type-2pps-event-type-entity.interface';
import { IEventTypeEntity } from '../model/entities/event-type-entity.interface';
import { EventTypeComplete } from '../model/event-type-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationEngtype2eventtypeDataService extends DataServiceFlatLeaf<IEngType2PpsEventTypeEntity, IEventTypeEntity, EventTypeComplete> {

	public constructor(private eventTypeService: ConfigurationEventTypeDataService) {
		const options: IDataServiceOptions<IEngType2PpsEventTypeEntity> = {
			apiUrl: 'productionplanning/configuration/engtype2ppseventtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: ident => ({eventTypeId: ident.pKey1})
			},
			createInfo: <IDataServiceEndPointOptions>{
				usePost: true,
				prepareParam: ident => ({Id: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngType2PpsEventTypeEntity, IEventTypeEntity, EventTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EngType2PpsEventType',
				parent: eventTypeService,
			},
		};

		super(options);
	}

}








