/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyRoleBas2FrmEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyCreateRoleDataService extends DataServiceFlatLeaf<ICompanyRoleBas2FrmEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompanyRoleBas2FrmEntity>  = {
			apiUrl: 'basics/company/createrole',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
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
			roleInfo: <IDataServiceChildRoleOptions<ICompanyRoleBas2FrmEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CreateRole',
				parent: basicsCompanyMainDataService,

			},


		};

		super(options);
	}

	public override isParentFn(parentKey: ICompanyEntity, entity: ICompanyRoleBas2FrmEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



