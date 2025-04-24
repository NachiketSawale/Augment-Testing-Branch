/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ModelMapAreaComplete } from '../model/model-map-area-complete.class';
import { IModelMapAreaEntity } from '../model/entities/model-map-area-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class ModelMapAreaDataService extends DataServiceFlatRoot<IModelMapAreaEntity, ModelMapAreaComplete> {

	public constructor() {
		const options: IDataServiceOptions<IModelMapAreaEntity> = {
			apiUrl: 'model/map/area',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: '//TODO: Add deleteInfo endpoint here'
			},
			roleInfo: <IDataServiceRoleOptions<IModelMapAreaEntity>>{
				role: ServiceRole.Root,
				itemName: 'ModelMapAreas',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IModelMapAreaEntity | null): ModelMapAreaComplete {
		const complete = new ModelMapAreaComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}







