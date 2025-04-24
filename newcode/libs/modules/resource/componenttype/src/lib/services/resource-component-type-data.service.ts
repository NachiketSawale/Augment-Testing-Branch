/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ResourceComponentTypeComplete } from '../model/resource-component-type-complete.class';
import { IResourcePlantComponentTypeEntity } from '@libs/resource/interfaces'
import { isNil } from "lodash";

@Injectable({
	providedIn: 'root'
})

export class ResourceComponentTypeDataService extends DataServiceFlatRoot<IResourcePlantComponentTypeEntity, ResourceComponentTypeComplete> {

	public constructor() {
		const options: IDataServiceOptions<IResourcePlantComponentTypeEntity> = {
			apiUrl: 'resource/componenttype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourcePlantComponentTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'ComponentTypes',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IResourcePlantComponentTypeEntity | null): ResourceComponentTypeComplete {
		const complete = new ResourceComponentTypeComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.ComponentTypes = [modified];
		}

		return complete;
	}


	public override getModificationsFromUpdate(complete: ResourceComponentTypeComplete): IResourcePlantComponentTypeEntity[] {
		if (isNil(complete.ComponentTypes)) {
			complete.ComponentTypes = [];
		}

		return complete.ComponentTypes;
	}
}







