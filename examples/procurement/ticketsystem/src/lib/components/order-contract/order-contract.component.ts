/*
 * Copyright(c) RIB Software GmbH
 */
import { Component } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { PageEvent } from '@angular/material/paginator';
import { ProcurementTicketSystemOrderRequestScope } from '../../model/order-request-scope';

/**
 * order contract container
 */
@Component({
	selector: 'procurement-ticket-system-order-contract',
	templateUrl: './order-contract.component.html',
	styleUrls: ['./order-contract.component.scss'],
})
export class ProcurementTicketSystemOrderContractComponent extends ContainerBaseComponent {
	/**
	 * Order contract scope
	 */
	public scope = new ProcurementTicketSystemOrderRequestScope();

	/**
	 * initialization
	 */
	public ngOnInit() {
		this.scope.showList();
	}

	/**
	 * Handle page event
	 * @param e
	 */
	public handlePageEvent(e: PageEvent) {
		this.scope.request.ItemsPerPage = e.pageSize;
		this.scope.request.CurrentPage = e.pageIndex + 1;
		this.scope.paging();
	}
}
