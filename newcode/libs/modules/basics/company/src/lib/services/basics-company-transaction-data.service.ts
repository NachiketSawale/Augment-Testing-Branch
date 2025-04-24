/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IParentRole} from '@libs/platform/data-access';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';
import { ICompanyTransheaderCompleteEntity } from '../model/company-transheader-complete-entity.interface';
import { BasicsCompanyTransheaderDataService } from './basics-company-transheader-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyTransactionDataService extends DataServiceFlatLeaf<ICompanyTransactionEntity,ICompanyTransheaderEntity, ICompanyTransheaderCompleteEntity >{

	public constructor(basicsCompanyTransheaderDataService:BasicsCompanyTransheaderDataService) {
		const options: IDataServiceOptions<ICompanyTransactionEntity>  = {
			apiUrl: 'basics/company/transaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyTransheaderDataService.getSelectedEntity();
					return {
						transheaderId: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyTransactionEntity,ICompanyTransheaderEntity, ICompanyTransheaderCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Transaction',
				parent: basicsCompanyTransheaderDataService as unknown as IParentRole<ICompanyTransheaderEntity, ICompanyTransheaderCompleteEntity>,
			},


		};

		super(options);
	}
	public override isParentFn(parentKey: ICompanyTransheaderEntity, entity: ICompanyTransactionEntity): boolean {
		return entity.CompanyTransheaderFk === parentKey.Id;
	}


}



