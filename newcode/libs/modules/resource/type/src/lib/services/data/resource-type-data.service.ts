/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, EntityArrayProcessor, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IResourceTypeEntity , IResourceTypeUpdateEntity} from '@libs/resource/interfaces';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

export class ResourceTypeDataService extends DataServiceHierarchicalRoot<IResourceTypeEntity, IResourceTypeUpdateEntity> {

	public constructor() {
		const options: IDataServiceOptions<IResourceTypeEntity> = {
			apiUrl: 'resource/type',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'ResourceTypes'
			},
			entityActions: {createSupported: true, deleteSupported: true},
			processors: [new EntityArrayProcessor<IResourceTypeEntity>(['SubResources'])]
		};

		super(options);
	}

	public override createUpdateEntity(modified: IResourceTypeEntity | null): IResourceTypeUpdateEntity {
		return {
			MainItemId : modified? modified.Id :null,
			ResourceTypes : modified
		} as IResourceTypeUpdateEntity;
	}

	public override getModificationsFromUpdate(complete: IResourceTypeUpdateEntity): IResourceTypeEntity[] {
		if (complete.ResourceTypes) {
			return  [complete.ResourceTypes];
		}
		return [];

	}

	protected override checkCreateIsAllowed(entities: IResourceTypeEntity[] | IResourceTypeEntity | null): boolean {
		return true;
	}

	public override childrenOf(element: IResourceTypeEntity): IResourceTypeEntity[] {
		return element.SubResources ?? [];
	}

	public override parentOf(element: IResourceTypeEntity): IResourceTypeEntity | null {
		if(element.ResourceTypeFk === undefined) {
			return null;
		}

		const parentId = element.ResourceTypeFk;
		const foundParent =  this.flatList().find(candidate => candidate.Id === parentId);

		if(foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	protected override onCreateSucceeded(created: object): IResourceTypeEntity {
		return created as IResourceTypeEntity;
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedEntity();
		if (selected === null) {
			return {};
		}

		const parent = this.parentOf(selected);
		if (parent) {
			return {
				PKey1: parent.Id
			};
		}else{
			return {};
		}
	}


	protected override provideCreateChildPayload(): object {
		return {
			PKey1: this.getSelectedEntity()?.Id,
		};
	}
}
