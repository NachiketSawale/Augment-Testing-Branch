/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';
import { IPaymentTermEntity } from '../model/entities/payment-term-entity.interface';
import { IPaymentTermComplete } from '../model/entities/payment-term-complete.interface';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';

/**
 * Payment Term entity data service
 */
@Injectable({
	providedIn: 'root'
})

export class PaymentTermDataService extends DataServiceFlatRoot<IPaymentTermEntity, IPaymentTermComplete> {
	public constructor() {
		const options: IDataServiceOptions<IPaymentTermEntity> = {
			apiUrl: 'basics/payment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPaymentTermEntity>>{
				role: ServiceRole.Root,
				itemName: 'Payment'
			}
		};

		super(options);
	}

	public override getModificationsFromUpdate(complete: IPaymentTermComplete): IPaymentTermEntity[] {
		if (complete.Payment === null) {
			return [];
		}

		return [complete.Payment];
	}

	public override createUpdateEntity(modified: IPaymentTermEntity | null): IPaymentTermComplete {
		return {
			Payment: modified ? modified : null
		};
	}


}
