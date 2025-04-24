/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import {  ProjectMainCostGroupCatalogEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import {IProjectMainCostGroupCatalogComplete} from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root'
})


export class ProjectMainCostGroupCatalogDataService extends DataServiceFlatNode<ProjectMainCostGroupCatalogEntity,IProjectMainCostGroupCatalogComplete ,IProjectEntity, IProjectComplete>{

	public constructor( projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<ProjectMainCostGroupCatalogEntity>  = {
			apiUrl: 'project/main/costGroupCatalog',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ProjectMainCostGroupCatalogEntity,IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'CostGroupCatalogs',
				parent: projectMainDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: ProjectMainCostGroupCatalogEntity | null): IProjectMainCostGroupCatalogComplete {
		if (modified) {
			return {
				CostGroupCatalogId: modified.Id ?? 0,
				CostGroupCatalogs: modified
			} as IProjectMainCostGroupCatalogComplete;
		}
		return undefined as unknown as IProjectMainCostGroupCatalogComplete;
	}

}










