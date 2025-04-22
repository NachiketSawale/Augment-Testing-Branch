/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ContainerModuleRoute, IEditorPanels, UiContainerSystemMainViewService } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';

import { BasicsSharedModule } from '@libs/basics/shared';

import { ProcurementTicketSystemCommoditySearchComponent } from './components/commodity-search/commodity-search.component';
import { ProcurementTicketsystemModuleInfo } from './model/procurement-ticketsystem-module-info';
import { ProcurementTicketSystemShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProcurementTicketSystemItemCartComponent } from './components/item-cart/item-cart.component';
import { ProcurementTicketSystemItemQuantityComponent } from './components/item-quantity/item-quantity.component';
import { ProcurementTicketSystemOrderRequestComponent } from './components/order-request/order-request.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProcurementTicketSystemOrderCardComponent } from './components/order-card/order-card.component';
import { ProcurementTicketSystemCartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { ProcurementTicketSystemCartItemComponent } from './components/cart-item/cart-item.component';
import { ProcurementTicketSystemDeliveryOptionsComponent } from './components/delivery-options/delivery-options.component';
import { ProcurementTicketSystemCartItemViewComponent } from './components/cart-item-view/cart-item-view.component';
import { ProcurementTicketSystemCartItemOperationComponent } from './components/cart-item-operation/cart-item-operation.component';
import { ProcurementTicketSystemCartItemDetailComponent } from './components/cart-item-detail/cart-item-detail.component';
import { ProcurementTicketSystemPlaceOrderFormComponent } from './components/place-order-form/place-order-form.component';
import { ProcurementTicketSystemOrderContractComponent } from './components/order-contract/order-contract.component';

const routes: Routes = [new ContainerModuleRoute(ProcurementTicketsystemModuleInfo.instance)];

/**
 * Module configuration
 */
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule, BasicsSharedModule, MatPaginatorModule],
	declarations: [
		ProcurementTicketSystemCommoditySearchComponent,
		ProcurementTicketSystemShoppingCartComponent,
		ProcurementTicketSystemItemCartComponent,
		ProcurementTicketSystemItemQuantityComponent,
		ProcurementTicketSystemOrderRequestComponent,
		ProcurementTicketSystemOrderCardComponent,
		ProcurementTicketSystemCartItemComponent,
		ProcurementTicketSystemCartItemListComponent,
		ProcurementTicketSystemDeliveryOptionsComponent,
		ProcurementTicketSystemCartItemViewComponent,
		ProcurementTicketSystemCartItemOperationComponent,
		ProcurementTicketSystemCartItemDetailComponent,
		ProcurementTicketSystemPlaceOrderFormComponent,
		ProcurementTicketSystemOrderContractComponent,
	],
	exports: [ProcurementTicketSystemCartItemListComponent],
})
export class ProcurementTicketsystemModule {
	public constructor(uiContainerSystemMainViewService: UiContainerSystemMainViewService) {
		const panelInfo: IEditorPanels[] = [
			{
				panel: [
					{
						content: ['fac9ea817e6c49309dccb99f105b180a'],
						pane: 'pane-0',
					},
				],
			},
			{
				panel: [
					{
						content: ['6352fd99d00d411aa82f213511935c58', '180C90D476894349B6F9C326C0DFD06D'],
						pane: 'pane-1',
					},
				],
			},
		];
		uiContainerSystemMainViewService.panelInfo = panelInfo;
	}
}
