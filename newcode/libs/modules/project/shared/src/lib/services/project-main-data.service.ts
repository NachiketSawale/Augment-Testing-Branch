/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IEntityList } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import {IProjectComplete, IProjectDataService, IProjectEntity} from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainDataService extends DataServiceFlatRoot<IProjectEntity, IProjectComplete> implements IProjectDataService<IProjectEntity, IProjectComplete>{

	public constructor() {
		const options: IDataServiceOptions<IProjectEntity> = {
			apiUrl: 'project/main',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IProjectEntity>>{
				role: ServiceRole.Root,
				itemName: 'Projects'
			},
			entityActions: {createSupported: true, deleteSupported: true},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IProjectEntity | null): IProjectComplete {
		// TODO: Use interface to create update entity
		const complete = {} as IProjectComplete;

		if(modified !== null) {
			complete.Projects = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: IProjectComplete): IProjectEntity[] {
		if (complete.Projects === null) {
			complete.Projects = [];
		}

		return complete.Projects;
	}

	protected override checkCreateIsAllowed(entities: IProjectEntity[] | IProjectEntity | null): boolean {
		return entities !== null;
	}

	protected takeOverUpdatedFromComplete(complete: IProjectComplete, entityList: IEntityList<IProjectEntity>) {
		if (complete && complete.Projects && complete.Projects.length > 0) {
			entityList.updateEntities(complete.Projects);
		}
	}
}
