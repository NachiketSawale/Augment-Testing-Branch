/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICompanyICPartnerAccEntity } from '@libs/basics/interfaces';
import { ICompanyICPartnerEntity } from '@libs/basics/interfaces';
import { ICompanyICPartnerCompleteEntity } from '../model/company-icpartner-complete-entity.interface';
import { BasicsCompanyICPartnerCardDataService } from './basics-company-icpartner-card-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyICPartnerAccDataService extends DataServiceFlatLeaf<ICompanyICPartnerAccEntity,ICompanyICPartnerEntity, ICompanyICPartnerCompleteEntity >{

	public constructor(basicsCompanyICPartnerCardDataService:BasicsCompanyICPartnerCardDataService) {
		const options: IDataServiceOptions<ICompanyICPartnerAccEntity>  = {
			apiUrl: 'basics/company/icpartneracc',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByICPartner',
				usePost: true,
				prepareParam: () => {
					const selection = basicsCompanyICPartnerCardDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0,
						filter: ''
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyICPartnerCardDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyICPartnerAccEntity,ICompanyICPartnerEntity, ICompanyICPartnerCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CompanyICPartnerAcc',
				parent: basicsCompanyICPartnerCardDataService,
			},

		};

		super(options);
	}



	public override isParentFn(parentKey: ICompanyICPartnerEntity, entity: ICompanyICPartnerAccEntity): boolean {
		return entity.BasCompanyIcpartnerFk === parentKey.Id;
	}

}



