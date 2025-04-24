/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { TimekeepingPaymentGroupComplete } from '../model/timekeeping-payment-group-complete.class';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IPaymentGroupEntity } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_PAYMENT_GROUP_DATA_TOKEN = new InjectionToken<TimekeepingPaymentGroupDataService>('timekeepingPaymentGroupDataToken');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPaymentGroupDataService extends DataServiceFlatRoot<IPaymentGroupEntity, TimekeepingPaymentGroupComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPaymentGroupEntity> = {
			apiUrl: 'timekeeping/paymentgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPaymentGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'PaymentGroup'

			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPaymentGroupEntity | null): TimekeepingPaymentGroupComplete {
		const complete = new TimekeepingPaymentGroupComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PaymentGroups = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: TimekeepingPaymentGroupComplete): IPaymentGroupEntity[] {
		if (complete.PaymentGroups === null) {
			complete.PaymentGroups = [];
		}

		return complete.PaymentGroups?? [];
	}

	private transferModifications2Complete(complete: TimekeepingPaymentGroupComplete, modified: IPaymentGroupEntity[]) {
		if (modified && modified.length > 0) {
			complete.MainItemId = modified[0].Id;
			complete.PaymentGroups = modified;
		}
	}
	public getProcessors() {
		return this.processor.getProcessors();
	}
}
