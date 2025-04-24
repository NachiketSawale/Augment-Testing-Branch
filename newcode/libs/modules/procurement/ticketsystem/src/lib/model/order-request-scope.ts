/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementTicketSystemOrderQueryParam } from './order-query-param';
import { ProcurementTicketSystemOrderQueryResponse } from './order-query-response';
import { inject, InjectionToken } from '@angular/core';
import { IProcurementQueryParam } from './interfaces/prc-order-query-param.interface';
import { OrderBaseService } from '../services/order-base.service';

export const PRC_ORDER_QUERY_TOKEN = new InjectionToken<IProcurementQueryParam>('procurement-order-query-token');

/**
 * Order request scope which used to store state and communicate among child components
 */
export class ProcurementTicketSystemOrderRequestScope {
	private readonly orderQueryParam = inject(PRC_ORDER_QUERY_TOKEN);
	/**
	 * Order Request service
	 */
	public orderRequestService;

	public constructor() {
		this.orderRequestService = new OrderBaseService(this.orderQueryParam);
	}

	/**
	 * Order Request request
	 */
	public request = new ProcurementTicketSystemOrderQueryParam();
	/**
	 * Order Request response
	 */
	public response = new ProcurementTicketSystemOrderQueryResponse();

	/**
	 * Paging Order Request
	 */
	public async paging() {
		const data = await this.loadData();
		this.response.Result = data.Result;
	}

	/**
	 *  load Order Request Data
	 */
	private async loadData() {
		return await this.orderRequestService.load(this.request);
	}

	/**
	 *  show Order Request List
	 */
	public async showList() {
		this.request.CurrentPage = 1;
		this.response = await this.loadData();
	}
}
