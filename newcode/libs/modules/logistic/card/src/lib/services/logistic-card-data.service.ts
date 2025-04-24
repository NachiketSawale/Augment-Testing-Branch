/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardComplete } from '../model/logistic-card-complete.class';
import { LogisticCardReadonlyProcessorService } from './logistic-card-readonly-processor.service';


@Injectable({
	providedIn: 'root'
})

export class LogisticCardDataService extends DataServiceFlatRoot<ILogisticCardEntity, LogisticCardComplete> {

	public constructor() {
		const options: IDataServiceOptions<ILogisticCardEntity> = {
			apiUrl: 'logistic/card/card',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ILogisticCardEntity>>{
				role: ServiceRole.Root,
				itemName: 'Cards',
			}
		};

		super(options);
		this.processor.addProcessor(new LogisticCardReadonlyProcessorService(this));

	}
	public override createUpdateEntity(modified: ILogisticCardEntity | null): LogisticCardComplete {
		const complete = new LogisticCardComplete();
		if (modified !== null) {
			complete.CardId = modified.Id;
			complete.Cards = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: LogisticCardComplete): ILogisticCardEntity[] {
		if (complete.Cards === null) {
			return complete.Cards = [];
		} else {
			return complete.Cards;
		}
	}
}












