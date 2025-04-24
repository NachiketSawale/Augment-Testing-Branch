/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyDeferaltypeEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyDeferaltypeDataService extends DataServiceFlatLeaf<ICompanyDeferaltypeEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompanyDeferaltypeEntity>  = {
			apiUrl: 'basics/company/deferaltype',
		   readInfo: <IDataServiceEndPointOptions>{
			endPoint: 'list',
			usePost: false,
			prepareParam: ident => {
				return { mainItemId : ident.pKey1};
			},
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
		roleInfo: <IDataServiceChildRoleOptions<ICompanyDeferaltypeEntity,ICompanyEntity, BasicsCompanyComplete>>{
			role: ServiceRole.Leaf,
			itemName: 'Deferaltype',
			parent: basicsCompanyMainDataService,
		},
	 };

		super(options);
	}

	public override isParentFn(parentKey: ICompanyEntity, entity: ICompanyDeferaltypeEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



