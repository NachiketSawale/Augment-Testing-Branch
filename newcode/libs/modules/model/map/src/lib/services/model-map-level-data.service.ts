/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ModelMapLevelComplete } from '../model/model-map-level-complete.class';
import { IModelMapLevelEntity } from '../model/entities/model-map-level-entity.interface';
@Injectable({
	providedIn: 'root'
})

export class ModelMapLevelDataService extends DataServiceFlatRoot<IModelMapLevelEntity, ModelMapLevelComplete> {

	public constructor() {
		const options: IDataServiceOptions<IModelMapLevelEntity> = {
			apiUrl: 'model/map/level',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: '//TODO: Add deleteInfo endpoint here' 
			},
			roleInfo: <IDataServiceRoleOptions<IModelMapLevelEntity>>{
				role: ServiceRole.Root,
				itemName: 'ModelMapLevels',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IModelMapLevelEntity | null): ModelMapLevelComplete {
		const complete = new ModelMapLevelComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}







