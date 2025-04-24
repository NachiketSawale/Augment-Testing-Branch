/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonEventsEntity, ProcurementCommonEventsDataService,
} from '@libs/procurement/common';
import { IInvHeaderEntity } from '../model/entities';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';


export const PROCUREMENT_CONTRACT_EVENTS_DATA_TOKEN = new InjectionToken<ProcurementInvoiceEventDataService>('procurementInvoiceEventDataService');


/**
 * events service in invoice
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceEventDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity,IInvHeaderEntity, InvComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementInvoiceHeaderDataService);
		super(parentService);
	}

	protected getPackageFk(parent: IInvHeaderEntity): number {
		if(parent) {
			return parent.PrcPackageFk!;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.PrcPackageFk;
	}
}