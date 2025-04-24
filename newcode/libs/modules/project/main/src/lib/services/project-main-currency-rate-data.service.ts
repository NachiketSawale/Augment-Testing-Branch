/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity, IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainCurrencyRateDataService extends DataServiceFlatLeaf<IProjectMainCurrencyRateEntity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectMainCurrencyRateEntity>  = {
			apiUrl: 'project/main/currencyrate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainCurrencyRateEntity,IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CurrencyRates',
				parent: projectMainDataService,
			},

		};

		super(options);
	}
}



