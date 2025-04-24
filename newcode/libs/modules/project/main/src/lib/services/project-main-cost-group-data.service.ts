/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import {  ProjectMainCostGroupCatalogEntity } from '@libs/project/interfaces';
import { IProjectMainCostGroupCatalogComplete } from '@libs/project/interfaces';
import { ProjectMainCostGroupEntityGenerated } from '@libs/project/interfaces';
import { ProjectMainCostGroupCatalogDataService } from './project-main-cost-group-catalog-data.service';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainCostGroupDataService extends DataServiceHierarchicalLeaf<ProjectMainCostGroupEntityGenerated,ProjectMainCostGroupCatalogEntity, IProjectMainCostGroupCatalogComplete > {


	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);
	public constructor(projectMainCostGroupCatalogDataService: ProjectMainCostGroupCatalogDataService) {
		const options: IDataServiceOptions<ProjectMainCostGroupEntityGenerated> = {
			apiUrl: 'project/main/costgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true
			},
			createInfo: {
				prepareParam: ident => {
					return {
						PKey1: ident.id,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ProjectMainCostGroupEntityGenerated, ProjectMainCostGroupCatalogEntity, IProjectMainCostGroupCatalogComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CostGroups',
				parent:projectMainCostGroupCatalogDataService
			},
			entityActions: {createSupported: true, deleteSupported: true},//To be discuss
			//TO DO //processors: [new EntityArrayProcessor<ProjectMainCostGroupEntity>(['costGroup'])]
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const projectCatalog = this.getSelectedParent();
		return {
			PKey1 : projectCatalog?.Id,
			filter: '',
		};
	}

	protected override onLoadSucceeded(loaded: object): ProjectMainCostGroupEntityGenerated[] {
		let entities = loaded as ProjectMainCostGroupEntityGenerated[];
		entities = this.treeDataHelper.flatTreeArray(entities, e => e.ChildItems);
		return entities;
	}

	public override childrenOf(element: ProjectMainCostGroupEntityGenerated): ProjectMainCostGroupEntityGenerated[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: ProjectMainCostGroupEntityGenerated): ProjectMainCostGroupEntityGenerated | null {
		if (element.CostGroupCatalogFk == null) {
			return null;
		}
		const parentId = element.CostGroupCatalogFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
}







