/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions} from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { ILogisticCardDocumentEntity, ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardComplete } from '../model/logistic-card-complete.class';
import { LogisticCardDataService } from './logistic-card-data.service';

@Injectable({
	providedIn: 'root'
})

export class LogisticCardDocumentDataService extends DocumentDataLeafService<ILogisticCardDocumentEntity, ILogisticCardEntity, LogisticCardComplete>{

	public constructor(parentDataService: LogisticCardDataService) {
		const options: IDataServiceOptions<ILogisticCardDocumentEntity>  = {
			apiUrl: 'logistic/card/jobcarddocument',
			createInfo: {
				prepareParam: ident => {
					const card = parentDataService.getSelectedEntity();
					return {
						Pkey1: card?.Id ?? 0
					};
				}
			},
			readInfo: {
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCardDocumentEntity, ILogisticCardEntity, LogisticCardComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'JobCardDocument',
				parent: parentDataService,
			},
		};

		super(options);
	}


	public override isParentFn(parentKey: ILogisticCardEntity, entity: ILogisticCardDocumentEntity): boolean {
		return entity.JobCardFk === parentKey.Id;
	}
}








