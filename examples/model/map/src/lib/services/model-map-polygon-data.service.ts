/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ModelMapPolygonComplete } from '../model/model-map-polygon-complete.class';
import { IModelMapPolygonEntity } from '../model/entities/model-map-polygon-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class ModelMapPolygonDataService extends DataServiceFlatRoot<IModelMapPolygonEntity, ModelMapPolygonComplete> {

	public constructor() {
		const options: IDataServiceOptions<IModelMapPolygonEntity> = {
			apiUrl: 'model/map/polygon',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: '//TODO: Add deleteInfo endpoint here' 
			},
			roleInfo: <IDataServiceRoleOptions<IModelMapPolygonEntity>>{
				role: ServiceRole.Root,
				itemName: 'ModelMapPolygons',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IModelMapPolygonEntity | null): ModelMapPolygonComplete {
		const complete = new ModelMapPolygonComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}







