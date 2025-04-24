/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { ICompanyPeriodCompleteEntity } from '../model/company-period-complete-entity.interface';
import { BasicsCompanyPeriodsDataService } from './basics-company-periods-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyTransheaderDataService extends DataServiceFlatLeaf<ICompanyTransheaderEntity,ICompanyPeriodEntity, ICompanyPeriodCompleteEntity >{

	public constructor(basicsCompanyPeriodsDataService:BasicsCompanyPeriodsDataService) {
		const options: IDataServiceOptions<ICompanyTransheaderEntity>  = {
			apiUrl: 'basics/company/transheader',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyPeriodsDataService.getSelectedEntity();
					return {
						companyId: selection?.CompanyFk ?? 0,
						periodId : selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyTransheaderEntity,ICompanyPeriodEntity, ICompanyPeriodCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Transheader',
				parent: basicsCompanyPeriodsDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: ICompanyPeriodCompleteEntity, entity: ICompanyTransheaderEntity): boolean {
		return entity.CompanyPeriodFk === parentKey.MainItemId;
	}

}



