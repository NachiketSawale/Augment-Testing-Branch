/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, EntityArrayProcessor, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { IProjectComplete, IProjectLocationEntity, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from './project-main-data.service';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { set } from 'lodash';


@Injectable({
	providedIn: 'root'
})

export class ProjectLocationDataService extends DataServiceHierarchicalLeaf<IProjectLocationEntity,
	IProjectEntity, IProjectComplete> {

	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor() {
		const options: IDataServiceOptions<IProjectLocationEntity> = {
			apiUrl: 'project/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false
			},
			createInfo:{
				prepareParam: ident => {
					const param = {
						Id: ident.id
					};
					if (ident.id === 0 && ident.pKey1 !== undefined){
						set(param, 'Id', ident.pKey1);
					}
					if(ident.pKey1 !== undefined && ident.pKey1 !== param.Id) {
						set(param, 'PKey1', ident.pKey1);
					}

					return param;
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectLocationEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Locations',
				parent: inject(ProjectMainDataService)
			},
			processors: [new EntityArrayProcessor<IProjectLocationEntity>(['Locations'])]
		};

		super(options);
	}


	protected override provideLoadPayload(): object {
		const project = this.getSelectedParent();
		return {
			projectId: project?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IProjectLocationEntity[] {
		let entities = loaded as IProjectLocationEntity[];

		entities = this.treeDataHelper.flatTreeArray(entities, e => e.Locations);

		return entities;
	}

	public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
		return element.Locations ?? [];
	}

	public override parentOf(element: IProjectLocationEntity): IProjectLocationEntity | null {
		if (element.LocationParentFk == null) {
			return null;
		}

		const parentId = element.LocationParentFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override onTreeParentChanged(entity: IProjectLocationEntity, newParent: IProjectLocationEntity | null): void {
		entity.LocationParentFk = newParent?.Id;
	}
}
