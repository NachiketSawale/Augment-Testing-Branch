/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsExternalconfigEntity } from '../model/entities/pps-externalconfig-entity.interface';
import { PpsExternalconfigComplete } from '../model/pps-externalconfig-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ExternalConfigurationDataService extends DataServiceFlatRoot<IPpsExternalconfigEntity, PpsExternalconfigComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsExternalconfigEntity> = {
			apiUrl: 'productionplanning/configuration/externalconfig',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteconfig',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsExternalconfigEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsExternalconfig',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsExternalconfigEntity | null): PpsExternalconfigComplete {
		const complete = new PpsExternalconfigComplete();
		if (modified !== null) {
			complete.PpsExternalconfig = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsExternalconfigComplete): IPpsExternalconfigEntity[] {
		if (complete.PpsExternalconfig) {
			return [complete.PpsExternalconfig];
		}
		return [];
	}

	//TODO: the delete post needs an object but the framework posts request with an array.
	public override delete(entities: IPpsExternalconfigEntity[] | IPpsExternalconfigEntity): void {
		if (Array.isArray(entities)) {
			entities = entities[0];
		}
		super.delete(entities);
	}
}












