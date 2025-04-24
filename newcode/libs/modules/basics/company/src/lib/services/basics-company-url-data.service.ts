/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyUrlEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyUrlDataService extends DataServiceFlatLeaf<ICompanyUrlEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompanyUrlEntity>  = {
			apiUrl: 'basics/company/url',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
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
			roleInfo: <IDataServiceChildRoleOptions<ICompanyUrlEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Url',
				parent: basicsCompanyMainDataService,
			},


		};

		super(options);
	}
	public override isParentFn(parentKey: ICompanyEntity, entity: ICompanyUrlEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



