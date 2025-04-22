/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatRoot,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions,IEntityProcessor } from '@libs/platform/data-access';
import { ModelMapComplete } from '../model/model-map-complete.class';
import { Injectable } from '@angular/core';
import { ServiceRole } from '@libs/platform/data-access';
import { IModelMapEntity } from '../model/entities/model-map-entity.interface';
@Injectable({
	providedIn: 'root'
})

export class ModelMapDataService extends DataServiceFlatRoot<IModelMapEntity,ModelMapComplete> {

	public constructor() {
		const options: IDataServiceOptions<IModelMapEntity> = {
			apiUrl: 'model/map',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: '//TODO: Add deleteInfo endpoint here' 
			},
			createInfo:<IDataServiceEndPointOptions>
			{
				apiUrl: 'model/map',

			},
			roleInfo: <IDataServiceRoleOptions<IModelMapEntity>>{
				role: ServiceRole.Root,
				itemName: 'ModelMaps',
			}
			
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IModelMapEntity>): IEntityProcessor<IModelMapEntity>[] {
		return [
			...super.provideAllProcessor(options),
			{
				process: (toProcess: IModelMapEntity) => {
					this.doProcessItem(toProcess);
				},
				revertProcess: (toProcess: IModelMapEntity) => {
					//this.removeTransientValues(toProcess);
				}
			}
		];
	}

	public doProcessItem(mapSetItem: IModelMapEntity){
		mapSetItem.CompoundId = mapSetItem.ModelFk + '/' + mapSetItem.Id;
	}

	public override createUpdateEntity(modified: IModelMapEntity | null): ModelMapComplete {
		const complete = new ModelMapComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}







