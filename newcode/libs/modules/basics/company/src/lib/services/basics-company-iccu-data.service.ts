/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';



import { ICompanyICCuEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';

@Injectable({
	providedIn: 'root'
})


export class BasicsCompanyICCuDataService extends DataServiceFlatLeaf<ICompanyICCuEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompanyICCuEntity>  = {
			apiUrl: 'basics/company/ICCu',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: () => {
					const selection = basicsCompanyMainDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0,
						filter: ''
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyMainDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyICCuEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ICControllingUnits',
				parent: basicsCompanyMainDataService,
			},


		};

		super(options);
	}
	public override isParentFn(parentKey: ICompanyEntity, entity: ICompanyICCuEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



