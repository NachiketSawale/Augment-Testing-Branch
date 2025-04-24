/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProject2SalesTaxCodeComplete, IProject2SalesTaxCodeEntity, IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMain2SalesTaxCodeDataService extends DataServiceFlatNode<IProject2SalesTaxCodeEntity, IProject2SalesTaxCodeComplete, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<IProject2SalesTaxCodeEntity>  = {
			apiUrl: 'project/main/project2salestaxcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: {
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProject2SalesTaxCodeEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'Project2SalesTaxCodes',
				parent: projectMainDataService,
			},
		};

		super(options);
	}



	public override createUpdateEntity(modified: IProject2SalesTaxCodeEntity | null): IProject2SalesTaxCodeComplete {
		return {
			Project2SalesTaxCodeId: modified ? modified.Id : 0,
			Project2SalesTaxCodes: modified
		} as IProject2SalesTaxCodeComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProject2SalesTaxCodeComplete[], deleted: IProject2SalesTaxCodeEntity[]) {
		if (modified && modified.length > 0) {
			complete.Project2SalesTaxCodesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.Project2SalesTaxCodesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProject2SalesTaxCodeEntity[] {
		return (complete && complete.Project2SalesTaxCodesToSave)
			? complete.Project2SalesTaxCodesToSave.map(e => e.Project2SalesTaxCodes!)
			: [];
	}

}










