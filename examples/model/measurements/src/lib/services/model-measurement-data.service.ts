/*
 * Copyright(c) RIB Software GmbH
 */

import { IModelMeasurementEntity } from '../model/entities/model-measurement-entity.interface';
import { IModelMeasurementCompleteEntity } from '../model/entities/model-measurement-complete-entity.interface';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ModelMeasurementDataService
	extends DataServiceFlatRoot<IModelMeasurementEntity, IModelMeasurementCompleteEntity> {

	public constructor() {
		const options: IDataServiceOptions<IModelMeasurementEntity> = {
			apiUrl: 'model/measurement/',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: ''
			},
			roleInfo: <IDataServiceRoleOptions<IModelMeasurementEntity>>{
				role: ServiceRole.Root,
				itemName: 'ModelMeasurements',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: true
			}
		};
		super(options);
	}
}












