/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObjectEntity, IObjectSetEntity, ObjectSetComplete } from '../model/models';
import { ModelMainObjectDataService } from './model-main-object-data.service';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ModelMainObjectSetDataService extends DataServiceFlatNode<IObjectSetEntity, ObjectSetComplete, IModelObjectEntity, ModelObjectComplete> {

	public constructor(private objectDataService: ModelMainObjectDataService) {
		const options: IDataServiceOptions<IObjectSetEntity> = {
			apiUrl: 'model/main/objectset',
			readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
			createInfo:<IDataServiceEndPointOptions>{
				endpoint: 'create'
			},
			entityActions: {
				deleteSupported: true,
				createSupported: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IObjectSetEntity, IModelObjectEntity, ModelObjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'ObjectSet',
				mainItemName: 'ModelFk',
				parent: objectDataService,
			},
		};

		super(options);
	}

	/**
	 * name TODO as pinning context is not migrated
	 */
	// public override provideCreatePayload(): object {
	// 	const selectedProject = this.getSelectedParent();
    //                 return {
    //                     mainItemId: selectedProject.Id ? selectedProject.Id : null
    //                 };
	// }

	// public override canCreate(): boolean {
	// 	if(this.getSelectedParent()) {
	// 		const selectedProject = this.getSelectedParent();
	// 		const data =  (selectedProject?.Id && selectedProject?.Id > 0 && ModelMainObjectDataService.length > 0);
	// 	    return data;
	// 	}
	// 	return false;
		
	// }

	
	public override canDelete(): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const selItem: IObjectSetEntity = this.getSelection()[0];
		return super.canDelete();
	}

}










