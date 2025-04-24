/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { ICompanyEntity } from '@libs/basics/interfaces';
import { IBusinessYearNPeriodEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';
import { CompanyYearComplete } from '../model/company-year-complete.class';


@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyYearDataService extends DataServiceFlatNode<IBusinessYearNPeriodEntity, CompanyYearComplete,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<IBusinessYearNPeriodEntity>  = {
			apiUrl: 'basics/company/year',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessYearNPeriodEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Node,
				itemName: 'Year',
				parent: basicsCompanyMainDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBusinessYearNPeriodEntity | null): CompanyYearComplete {
		return new CompanyYearComplete();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: BasicsCompanyComplete, modified: CompanyYearComplete[], deleted: IBusinessYearNPeriodEntity[]) {
		if (modified && modified.length > 0) {
			complete.YearToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.YearToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCompanyComplete): IBusinessYearNPeriodEntity[] {
		return (complete && complete.YearToSave)
			? complete.YearToSave
			: [];
	}


	public override isParentFn(parentKey: ICompanyEntity, entity: IBusinessYearNPeriodEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}





