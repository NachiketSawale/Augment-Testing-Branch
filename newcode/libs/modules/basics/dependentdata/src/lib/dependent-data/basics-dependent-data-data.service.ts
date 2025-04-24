/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';
import { DependentDataComplete } from '../model/complete-class/dependent-data-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsDependentDataDataService extends DataServiceFlatRoot<IDependentDataEntity, DependentDataComplete> {

	public constructor() {
		const options: IDataServiceOptions<IDependentDataEntity> = {
			apiUrl: 'basics/dependentdata',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listFiltered',
				usePost: true
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteEntity'
			},
			roleInfo: <IDataServiceRoleOptions<IDependentDataEntity>>{
				role: ServiceRole.Root,
				itemName: 'DependentData',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IDependentDataEntity | null): DependentDataComplete {
		const complete = new DependentDataComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.DependentData = modified;
		}
		return complete;
	}

}