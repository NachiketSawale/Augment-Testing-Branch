/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ITimekeepingGroupEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';


@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyTimekeepingGroupDataService extends DataServiceFlatLeaf<ITimekeepingGroupEntity,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ITimekeepingGroupEntity>  = {
			apiUrl: 'basics/company/timekeepinggroup',
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
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingGroupEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'TimekeepingGroups',
				parent: basicsCompanyMainDataService,
			},


		};

		super(options);
	}
	public override isParentFn(parentKey: ICompanyEntity, entity: ITimekeepingGroupEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}



