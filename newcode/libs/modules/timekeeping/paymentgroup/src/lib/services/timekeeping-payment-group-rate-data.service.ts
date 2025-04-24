import {  Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
} from '@libs/platform/data-access';
import { TimekeepingPaymentGroupDataService } from './timekeeping-payment-group-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { TimekeepingPaymentGroupComplete } from '../model/timekeeping-payment-group-complete.class';
import { IPaymentGroupEntity, IPaymentGroupRateEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPaymentGroupRateDataService extends DataServiceFlatLeaf<IPaymentGroupRateEntity,
	IPaymentGroupEntity, TimekeepingPaymentGroupComplete> {
	public constructor(timekeepingPaymentGroupDataService : TimekeepingPaymentGroupDataService) {
		const options: IDataServiceOptions<IPaymentGroupRateEntity> = {
			apiUrl: 'timekeeping/paymentgroup/rate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPaymentGroupRateEntity,
				IPaymentGroupEntity, TimekeepingPaymentGroupComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Rates',
				parent: timekeepingPaymentGroupDataService
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: IPaymentGroupEntity, entity: IPaymentGroupRateEntity): boolean {
		return entity.PaymentGroupFk === parentKey.Id;
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: parent.Id,
		};
	}
}
