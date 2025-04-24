/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatRoot } from '@libs/platform/data-access';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { ResourceSkillUpdate } from '../model/resource-skill-update.class';

@Injectable({
	providedIn: 'root'
})
export class ResourceSkillDataService extends DataServiceFlatRoot<IResourceSkillEntity,ResourceSkillUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IResourceSkillEntity> = {
			apiUrl: 'resource/skill',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceSkillEntity>>{
				role: ServiceRole.Root,
				itemName: 'ResourceSkills'
			},
			processors: [new EntityArrayProcessor<IResourceSkillEntity>(['SubResources'])]
		};
		super(options);
	}
	public override createUpdateEntity(modified: IResourceSkillEntity | null): ResourceSkillUpdate {
		const complete = new ResourceSkillUpdate();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ResourceSkills = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ResourceSkillUpdate): IResourceSkillEntity[] {
		if (complete.ResourceSkills === null){
			return complete.ResourceSkills = [];
		}
		else{
			return complete.ResourceSkills;
		}
	}
}