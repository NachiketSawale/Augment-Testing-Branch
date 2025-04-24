/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IProcurementQueryParam } from '../model/interfaces/prc-order-query-param.interface';
import { OrderBaseService } from './order-base.service';

/**
 * Order Request service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementTicketSystemOrderRequestService extends OrderBaseService {
	public constructor() {
		const orderQueryParam: IProcurementQueryParam = {
			entityType: 'Requisition',
			orderList: 'procurement/ticketsystem/orders/list',
			commodity: 'basics/material/commoditysearch/getImageByMaterialId',
			requisition: 'procurement/requisition/requisition/changeheaderstatustocancelbyid',
		};
		super(orderQueryParam);
	}
}
