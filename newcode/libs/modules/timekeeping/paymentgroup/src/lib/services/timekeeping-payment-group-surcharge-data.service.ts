import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
} from '@libs/platform/data-access';
import { TimekeepingPaymentGroupDataService } from './timekeeping-payment-group-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { TimekeepingPaymentGroupComplete } from '../model/timekeeping-payment-group-complete.class';
import { IPaymentGroupEntity, IPaymentGroupSurEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPaymentGroupSurchargeDataService extends DataServiceFlatLeaf<IPaymentGroupSurEntity,
	IPaymentGroupEntity, TimekeepingPaymentGroupComplete> {

	public constructor(timekeepingPaymentGroupDataService : TimekeepingPaymentGroupDataService) {
		const options: IDataServiceOptions<IPaymentGroupSurEntity> = {
			apiUrl: 'timekeeping/paymentgroup/surcharge',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPaymentGroupSurEntity,
				IPaymentGroupEntity, TimekeepingPaymentGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Surcharges',
				parent: timekeepingPaymentGroupDataService
			}
		};

		super(options);
	}
	//TODO Not working if the two leaf have some parent

	public override isParentFn(parentKey: IPaymentGroupEntity, entity: IPaymentGroupSurEntity): boolean {
		return entity.PaymentGroupFk === parentKey.Id;
	}
	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: parent.Id,
		};
	}
}
