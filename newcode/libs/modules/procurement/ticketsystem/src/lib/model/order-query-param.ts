/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Order query request model
 */
export class ProcurementTicketSystemOrderQueryParam {
	/**
	 * current page of order request
	 */
	public CurrentPage: number = 1;

	/**
	 * current page of order request
	 */
	public ItemsPerPage: number = 5;

	/**
	 * current page of order request
	 */
	public EntityType: string = 'Requisition';

}

