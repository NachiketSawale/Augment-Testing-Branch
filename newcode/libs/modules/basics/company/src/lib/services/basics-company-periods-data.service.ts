/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatNode,ServiceRole, IDataServiceChildRoleOptions} from '@libs/platform/data-access';
import { BasicsCompanyPeriodsComplete } from '../model/basics-company-periods-complete.class';
import { BasicsCompanyYearDataService } from './basics-company-year-data.service';
import { ICompanyPeriodEntity, ICompanyYearEntity } from '@libs/basics/interfaces';
import { CompanyYearComplete } from '../model/company-year-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyPeriodsDataService extends DataServiceFlatNode<ICompanyPeriodEntity, BasicsCompanyPeriodsComplete,ICompanyYearEntity, CompanyYearComplete >{

	public constructor(private groupService: BasicsCompanyYearDataService) {
		super({
			apiUrl: 'basics/company/periods',
			roleInfo: <IDataServiceChildRoleOptions<ICompanyPeriodEntity, ICompanyYearEntity, CompanyYearComplete>>{
				role: ServiceRole.Node,
				itemName: 'Periods',
				parent: groupService,
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
			readInfo: {
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
		});
	}

	public override createUpdateEntity(modified: ICompanyPeriodEntity | null): BasicsCompanyPeriodsComplete {
		return new BasicsCompanyPeriodsComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerNodeModificationsToParentUpdate(complete: CompanyYearComplete, modified: BasicsCompanyPeriodsComplete[], deleted: ICompanyPeriodEntity[]) {
		if (modified && modified.length > 0) {
			complete.PeriodsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.PeriodsToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: CompanyYearComplete): ICompanyPeriodEntity[] {
		return (complete && complete.PeriodsToSave)
			? complete.PeriodsToSave.map(e => e.Periods!)
			: [];
	}

	public override isParentFn(parentKey: ICompanyYearEntity, entity: ICompanyPeriodEntity): boolean {
		return entity.CompanyYearFk === parentKey.Id;
	}

}





