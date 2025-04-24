/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ILogisticCardEntity, ILogisticCardWorkEntity } from '@libs/logistic/interfaces';
import { LogisticCardComplete } from '../model/logistic-card-complete.class';
import { LogisticCardDataService } from './logistic-card-data.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticCardWorkDataService extends DataServiceFlatLeaf<ILogisticCardWorkEntity, ILogisticCardEntity, LogisticCardComplete>{

	public constructor(parentDataService: LogisticCardDataService) {
		const options: IDataServiceOptions<ILogisticCardWorkEntity>  = {
			apiUrl: 'logistic/card/jobcardwork',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					const selection = parentDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id,
						Pkey2: selection?.LogisticContextFk,
						Pkey3: selection?.JobFk
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCardWorkEntity, ILogisticCardEntity, LogisticCardComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Works',
				parent: parentDataService,
			},

		};
		super(options);

	}

	public override isParentFn(parentKey: ILogisticCardEntity, entity: ILogisticCardWorkEntity): boolean {
		return entity.JobCardFk === parentKey.Id;
	}

	// TODO: Time processor is not correctly implement and will cause update failed
	// protected override provideAllProcessor(options: IDataServiceOptions<ILogisticCardWorkEntity>): IEntityProcessor<ILogisticCardWorkEntity>[] {
	// 	const allProcessor = super.provideAllProcessor(options);
	// 	allProcessor.push(this.provideDateProcessor());
	// 	return allProcessor;
	// }
	//
	// private provideDateProcessor(): IEntityProcessor<ILogisticCardWorkEntity> {
	// 	const dateProcessorFactory = inject(EntityDateProcessorFactory);
	// 	return dateProcessorFactory.createProcessorFromSchemaInfo<ILogisticCardWorkEntity>({moduleSubModule: 'Logistic.Card', typeName: 'JobCardWorkDto'});
	// }
}








