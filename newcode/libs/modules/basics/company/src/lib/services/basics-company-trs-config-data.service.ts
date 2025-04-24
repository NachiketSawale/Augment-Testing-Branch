/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { ITrsConfigEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';


@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyTrsConfigDataService extends DataServiceFlatLeaf<ITrsConfigEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ITrsConfigEntity>  = {
			apiUrl: 'basics/company/trsconfig',
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
			roleInfo: <IDataServiceChildRoleOptions<ITrsConfigEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'TrsConfig',
				parent: basicsCompanyMainDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: ICompanyEntity, entity: ITrsConfigEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



