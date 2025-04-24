/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IModelMeasurementPointEntity } from '../model/entities/model-measurement-point-entity.interface';
import { IModelMeasurementEntity } from '../model/entities/model-measurement-entity.interface';
import { IModelMeasurementCompleteEntity } from '../model/entities/model-measurement-complete-entity.interface';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ModelMeasurementDataService } from './model-measurement-data.service';

@Injectable({
	providedIn: 'root'
})

export class ModelMeasurementPointDataService extends DataServiceFlatLeaf<IModelMeasurementPointEntity,IModelMeasurementEntity, IModelMeasurementCompleteEntity>{

	public constructor() {
		const options: IDataServiceOptions<IModelMeasurementPointEntity>  = {
			apiUrl: 'model/measurement/point',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: ''
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelMeasurementPointEntity,IModelMeasurementEntity, IModelMeasurementCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelMeasurementPoints',
				parent: inject(ModelMeasurementDataService)
			},
		};

		super(options);
	}
}

