/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition, ContainerModuleInfoBase } from '@libs/ui/container-system';
import {
    ProcurementTicketSystemCommoditySearchComponent
} from '../components/commodity-search/commodity-search.component';
import {
    ProcurementTicketSystemOrderRequestComponent
} from '../components/order-request/order-request.component';
import {ProcurementTicketSystemCartItemViewComponent} from '../components/cart-item-view/cart-item-view.component';
import { PRC_ORDER_QUERY_TOKEN } from './order-request-scope';

/**
 * Ticket system module info.
 */
export class ProcurementTicketsystemModuleInfo extends ContainerModuleInfoBase {

	public static readonly instance = new ProcurementTicketsystemModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'procurement.ticketsystem';
	}

	protected override get containers(): ContainerDefinition[] {
		return [
			new ContainerDefinition(
				'fac9ea817e6c49309dccb99f105b180a',
				'procurement.ticketsystem.view.commoditySearch',
				ProcurementTicketSystemCommoditySearchComponent,
				'fac9ea817e6c49309dccb99f105b180a',
				'procurement.ticketsystem.view.commoditySearch'
			),
			new ContainerDefinition({
				uuid: '6352fd99d00d411aa82f213511935c58',
				id: 'procurement.ticketsystem.view.orderRequest',
				title: {
					text: 'Order Request',
					key: 'procurement.ticketsystem.view.orderOrRequest'
				},
				containerType: ProcurementTicketSystemOrderRequestComponent,
				permission: '6352fd99d00d411aa82f213511935c58',
				providers: [
					{
						provide: PRC_ORDER_QUERY_TOKEN,
						useValue: {
							orderList: 'procurement/ticketsystem/orders/list',
							commodity: 'basics/material/commoditysearch/getImageByMaterialId',
							requisition: 'procurement/requisition/requisition/changeheaderstatustocancelbyid',
							entityType: 'Requisition'
						},
					},
				]
			}),
			new ContainerDefinition({
				uuid: '0c997bc34e2d42f59b93a51cbbe7f269',
				id: 'procurement.ticketsystem.view.orderOrContract',
				title: {
					text: 'Order Contract',
					key: 'procurement.ticketsystem.view.orderOrContract'
				},
				containerType: ProcurementTicketSystemOrderRequestComponent,
				permission: '4e0572d7dc684800b1e95abd90fbdd40',
				providers: [
					{
						provide: PRC_ORDER_QUERY_TOKEN,
						useValue: {
							orderList: 'procurement/ticketsystem/orders/list',
							commodity: 'basics/material/commoditysearch/getImageByMaterialId',
							requisition: 'procurement/contract/header/changeheaderstatustocancelbyid',
							entityType: 'Contract'
						},
					},
				]
			}),
			new ContainerDefinition(
				'180C90D476894349B6F9C326C0DFD06D',
				'procurement.ticketsystem.view.cartItem',
				ProcurementTicketSystemCartItemViewComponent,
				'180c90d476894349b6f9c326c0dfd06d',
				'procurement.ticketsystem.view.cartItem'
			)
		];
	}
}