/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IProcurementQueryParam } from '../model/interfaces/prc-order-query-param.interface';
import { OrderBaseService } from './order-base.service';

/**
 * Order Contract service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementTicketSystemOrderContractService extends OrderBaseService {
	public constructor() {
		const orderQueryParam: IProcurementQueryParam = {
			entityType: 'Contract',
			orderList: 'procurement/ticketsystem/orders/list',
			commodity: 'basics/material/commoditysearch/getImageByMaterialId',
			requisition: 'procurement/contract/header/changeheaderstatustocancelbyid',
		};
		super(orderQueryParam);
	}
}
