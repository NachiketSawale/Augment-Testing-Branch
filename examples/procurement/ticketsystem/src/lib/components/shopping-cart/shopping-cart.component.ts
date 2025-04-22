/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject} from '@angular/core';
import {MaterialSearchScope} from '@libs/basics/shared';

/**
 * Shopping cart icon in search bar
 */
@Component({
	selector: 'procurement-ticket-system-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.scss'],
})
export class ProcurementTicketSystemShoppingCartComponent {
	/**
	 * Material search scope
	 */
	public scope = inject(MaterialSearchScope);

	/**
	 * Go to shopping cart view
	 */
	public goShoppingCart() {

	}
}
