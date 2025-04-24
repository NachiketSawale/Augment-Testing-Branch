/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ProcurementTicketSystemCommoditySearchService } from '../../services/commodity-search.service';
import { ProcurementTicketSystemShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { ProcurementTicketSystemItemCartComponent } from '../item-cart/item-cart.component';
import { ProcurementTicketSystemItemQuantityComponent } from '../item-quantity/item-quantity.component';

/**
 * Commodity search container
 */
@Component({
	selector: 'procurement-ticket-system-commodity-search',
	templateUrl: './commodity-search.component.html',
	styleUrls: ['./commodity-search.component.scss'],
})
export class ProcurementTicketSystemCommoditySearchComponent extends ContainerBaseComponent implements OnInit {
	/**
	 * Search service
	 */
	public searchService = inject(ProcurementTicketSystemCommoditySearchService);

	/**
	 * Translation service
	 */
	public translateService = inject(PlatformTranslateService);

	/**
	 * Search options
	 */
	public searchOptions = {
		shoppingCartComponent: ProcurementTicketSystemShoppingCartComponent,
		itemCartComponent: ProcurementTicketSystemItemCartComponent,
		itemQuantityComponent: ProcurementTicketSystemItemQuantityComponent,
	};

	/**
	 * initialization
	 */
	public ngOnInit() {
		this.translateService.load(['procurement.ticketsystem']);
	}
}
