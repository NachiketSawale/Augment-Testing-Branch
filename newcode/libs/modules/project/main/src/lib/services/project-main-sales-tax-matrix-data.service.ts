/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProject2SalesTaxCodeComplete, IProject2SalesTaxCodeEntity, ISalesTaxMatrixEntity } from '@libs/project/interfaces';
import { ProjectMain2SalesTaxCodeDataService } from './project-main-2-sales-tax-code-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainSalesTaxMatrixDataService extends DataServiceFlatLeaf<ISalesTaxMatrixEntity,IProject2SalesTaxCodeEntity, IProject2SalesTaxCodeComplete>{

	public constructor(projectMain2SalesTaxCodeDataService: ProjectMain2SalesTaxCodeDataService) {
		const options: IDataServiceOptions<ISalesTaxMatrixEntity>  = {
			apiUrl: 'project/main/salestaxmatrix',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: {
				prepareParam: () => {
					const selection = projectMain2SalesTaxCodeDataService.getSelection()[0];
					return {
						PKey1: selection.Id,
						PKey2: selection.ProjectFk
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ISalesTaxMatrixEntity,IProject2SalesTaxCodeEntity, IProject2SalesTaxCodeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SalesTaxMatrix',
				parent: projectMain2SalesTaxCodeDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProject2SalesTaxCodeComplete, modified: ISalesTaxMatrixEntity[], deleted: ISalesTaxMatrixEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.SalesTaxMatrixToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.SalesTaxMatrixToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProject2SalesTaxCodeComplete): ISalesTaxMatrixEntity[] {
		if (complete && complete.SalesTaxMatrixToSave) {
			return complete.SalesTaxMatrixToSave;
		}

		return [];
	}

}








