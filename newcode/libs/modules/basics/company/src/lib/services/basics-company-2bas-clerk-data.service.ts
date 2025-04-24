/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompany2BasClerkEntity, ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';


@Injectable({
	providedIn: 'root'
})


export class BasicsCompany2basClerkDataService extends DataServiceFlatLeaf<ICompany2BasClerkEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompany2BasClerkEntity>  = {
			apiUrl: 'basics/company/basclerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.pKey1};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyMainDataService.getSelectedEntity();
					return {
						mainItemId: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompany2BasClerkEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BasClerk',
				parent: basicsCompanyMainDataService,

			},


		};
		//TODO Update is not working because of DataServiceHierarchicalRoot

		super(options);
	}

	public override isParentFn(parentKey: ICompanyEntity, entity: ICompany2BasClerkEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}
}



