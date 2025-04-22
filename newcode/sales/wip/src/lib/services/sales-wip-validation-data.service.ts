/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IWipValidationEntity } from '../model/entities/wip-validation-entity.interface';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root'
})

export class SalesWipValidationDataService extends DataServiceFlatLeaf<IWipValidationEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IWipValidationEntity> = {
			apiUrl: 'sales/wip/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId : ident.pKey1
					};
				}
			},
			createInfo:{
				prepareParam: ident => {
					const selection = dataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IWipValidationEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WipValidation',
				parent: dataService
			}
		};

		super(options);
	}
	public override canCreate() {
		return false;
	}

	public override canDelete() {
		return false;
	}
}












