/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IModelObjectEntity } from '../model/entities/model-object-entity.interface';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ModelMainObjectDataService extends DataServiceFlatRoot<IModelObjectEntity, ModelObjectComplete> {

	public constructor() {
		const options: IDataServiceOptions<IModelObjectEntity> = {
			apiUrl: 'model/main/object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete' 
			},
			roleInfo: <IDataServiceRoleOptions<IModelObjectEntity>>{
				role: ServiceRole.Root,
				itemName: 'Objects',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IModelObjectEntity | null) : ModelObjectComplete {
		const complete = new ModelObjectComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

	public override canDelete(): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const selItem : IModelObjectEntity = this.getSelection()[0];
		return super.canDelete();
	}
}





		
			





