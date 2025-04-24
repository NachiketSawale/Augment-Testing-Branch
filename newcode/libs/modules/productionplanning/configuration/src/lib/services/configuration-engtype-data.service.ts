/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';


import { EngtypeComplete } from '../model/engtype-complete.class';
import { IEngTypeEntity } from '../model/entities/eng-type-entity.interface';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationEngtypeDataService extends DataServiceFlatRoot<IEngTypeEntity, EngtypeComplete> {

	public constructor() {
		const options: IDataServiceOptions<IEngTypeEntity> = {
			apiUrl: 'productionplanning/configuration/engtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEngTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'EngType',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IEngTypeEntity | null): EngtypeComplete {
		const complete = new EngtypeComplete();
		if (modified !== null) {
			complete.EngType = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EngtypeComplete): IEngTypeEntity[] {
		if (complete.EngType) {
			return [complete.EngType];
		}
		return [];
	}

}












