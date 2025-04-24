/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IInvHeaderEntity, IInvValidationEntity } from '../model/entities';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { InvComplete } from '../model/inv-complete.class';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceValidationGridDataService extends DataServiceFlatLeaf<IInvValidationEntity, IInvHeaderEntity, InvComplete> {
	public constructor(parentDataService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvValidationEntity> = {
			apiUrl: 'procurement/invoice/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvValidationEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InvValidation',
				parent: parentDataService,
			},
		};
		super(options);		
	}

	/**
	 * To share message from ProcurementInvoiceValidationsMessageLookupComponent to PrcInvoiceMessageComponent
	 */
	public messagesSubject = new BehaviorSubject<string>('');
	public messages$ = this.messagesSubject.asObservable();
	public sendMessages(messages: string) {
		this.messagesSubject.next(messages);
	}
}
