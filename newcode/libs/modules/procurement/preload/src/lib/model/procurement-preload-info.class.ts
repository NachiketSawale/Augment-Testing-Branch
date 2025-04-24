/*
 * Copyright(c) RIB Software GmbH
 */
import { ModulePreloadInfoBase, TileSize, ITile, ISubModuleRouteInfo, IWizard, TileGroup, LazyInjectableInfo } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { PROCUREMENT_CONTRACT_WIZARDS } from './wizards/procurement-contract-wizards';
import { PROCUREMENT_REQUISITION_WIZARDS } from './wizards/procurement-requisition-wizards';
import { PROCUREMENT_INVENTORY_HEADER_WIZARDS } from './wizards/procurement-inventory-header-wizards';
import { PROCUREMENT_PACKAGE_WIZARDS } from './wizards/package-wizards.model';
import { PROCUREMENT_RFQ_WIZARDS } from './wizards/procurement-rfq-wizards';
import { PROCUREMENT_PES_WIZARDS } from './wizards/procurement-pes-wizards';
import { PROCUREMENT_COMMON_WIZARDS } from './wizards/common-wizard.model';
import { PROCUREMENT_QUOTE_WIZARDS } from './wizards/procurement-quote-wizards';
import { PROCUREMENT_INVOICE_WIZARDS } from './wizards/invoice-wizards';
import { PROCUREMENT_STOCK_WIZARDS } from './wizards/procurement-stock-wizards';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { PROCUREMENT_ORDERPROPOSALS_WIZARDS } from './wizards/procurement-orderproposals-wizards';
import { PROCUREMENT_PRICECOMPARISION_WIZARDS } from './wizards/procurement-pricecomparison-wizards';

export class ProcurementPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new ProcurementPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'procurement';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'procurement.package',
				displayName: {
					text: 'Package',
					key: 'cloud.desktop.moduleDisplayNamePackage',
				},
				description: {
					text: 'Management of Package',
					key: 'cloud.desktop.moduleDescriptionPackage',
				},
				iconClass: 'ico-package',
				color: 3885211,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'procurement/package',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 9,
				permissionGuid: 'df5d81d556744883b1fdd87a5e344018',
			},
			{
				id: 'procurement.requisition',
				displayName: {
					text: 'Requisition',
					key: 'cloud.desktop.moduleDisplayNameRequisition',
				},
				description: {
					text: 'Management of Requisition',
					key: 'cloud.desktop.moduleDescriptionRequisition',
				},
				iconClass: 'ico-requisition',
				color: 3885211,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/requisition',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 10,
				permissionGuid: '3b4f62ad6feb4b2287a5e3d1fe21ad85',
			},
			{
				id: 'procurement.contract',
				tileSize: TileSize.Small,
				color: 6056641,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Programs,
				iconClass: 'ico-contracts',
				iconColor: 16777215,
				defaultSorting: 14,
				displayName: {
					text: 'Contract',
					key: 'cloud.desktop.moduleDisplayNameContract',
				},
				description: {
					text: 'Management of Contract',
					key: 'cloud.desktop.moduleDescriptionContract',
				},
				permissionGuid: '58424e68c5b04ae1a81b4116558f6892',
				targetRoute: 'procurement/contract',
			},
			{
				id: 'procurement.ticketsystem',
				tileSize: TileSize.Large,
				color: 2976871,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Programs,
				iconClass: 'ico-ticket-system',
				iconColor: 16777215,
				defaultSorting: 15,
				displayName: {
					text: 'Ticket System',
					key: 'cloud.desktop.moduleDisplayNameTicketSystem',
				},
				description: {
					text: 'Management of TicketSystem',
					key: 'cloud.desktop.moduleDescriptionTicketSystem',
				},
				permissionGuid: '43f36d42d7fe49149a50ed8bc522f5ea',
				targetRoute: 'procurement/ticketsystem',
			},
			{
				id: 'procurement.rfq',
				tileSize: TileSize.Small,
				color: 6056641,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Programs,
				iconClass: 'ico-rfq',
				iconColor: 16777215,
				defaultSorting: 3,
				displayName: {
					text: 'RfQ',
					key: 'cloud.desktop.moduleDisplayNameRfQ',
				},
				description: {
					text: 'RfQ',
					key: 'cloud.desktop.moduleDescriptionRfQ',
				},
				permissionGuid: '5a2904a3c3dd4c3aa7fbd423e0bf3854',
				targetRoute: 'procurement/rfq',
			},
			{
				id: 'procurement.quote',
				tileSize: TileSize.Small,
				color: 3226753,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Programs,
				iconClass: 'ico-quote',
				iconColor: 16777215,
				defaultSorting: 4,
				displayName: {
					text: 'Quote',
					key: 'cloud.desktop.moduleDisplayNameQuote',
				},
				description: {
					text: 'Management of quote',
					key: 'cloud.desktop.moduleDescriptionQuote',
				},
				permissionGuid: '7b3404d1fbc74272abf7b8b63d154bfa',
				targetRoute: 'procurement/quote',
			},
			{
				id: 'procurement.stock',
				displayName: {
					text: 'Stock',
					key: 'cloud.desktop.moduleDisplayNameStock',
				},
				description: {
					text: 'Management of Stock',
					key: 'cloud.desktop.moduleDescriptionStock',
				},
				iconClass: 'ico-stock-management',
				color: 4543669,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/stock',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'f8562d1564ad49be9df14c1eaa18ad9a',
			},
			{
				id: 'procurement.pricecomparison',
				tileSize: TileSize.Small,
				color: 4543669,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Programs,
				iconClass: 'ico-price-compare',
				iconColor: 16777215,
				defaultSorting: 5,
				displayName: {
					text: 'Price Comparison',
					key: 'cloud.desktop.moduleDisplayNamePriceComparison',
				},
				description: {
					text: 'Management of PriceComparison',
					key: 'cloud.desktop.moduleDescriptionPriceComparison',
				},
				permissionGuid: '21a07b7ac9fc45aba5d2b7d3fee935bf',
				targetRoute: 'procurement/pricecomparison',
			},
			{
				id: 'procurement.inventory',
				displayName: {
					text: 'Inventory',
					key: 'cloud.desktop.moduleDisplayNameInventory',
				},
				description: {
					text: 'Management of Inventory',
					key: 'cloud.desktop.moduleDescriptionInventory',
				},
				iconClass: 'ico-inventory',
				color: 4543669,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/inventory',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'b5e3944b781d4581bebf4dd90fa74380',
			},
			{
				id: 'procurement.orderproposals',
				displayName: {
					text: 'Order Proposals',
					key: 'cloud.desktop.moduleDisplayNameOrderProposals',
				},
				description: {
					text: 'Management of Order Proposals',
					key: 'cloud.desktop.moduleDescriptionOrderProposals',
				},
				iconClass: 'ico-orders',
				color: 4543669,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/orderproposals',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'b2ad1c9d316044e8992b59a8b34652eb',
			},
			{
				id: 'procurement.pes',
				displayName: {
					text: 'Pes',
					key: 'cloud.desktop.moduleDisplayNamePerformanceEntrySheet',
				},
				description: {
					text: 'Performance Entry Sheet',
					key: 'cloud.desktop.moduleDescriptionPerformanceEntrySheet',
				},
				iconClass: 'ico-pes',
				color: 3885211,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/pes',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '823f48a7d6024cb7a568ed02f376cbb7',
			},
			{
				id: 'procurement.invoice',
				displayName: {
					text: 'Invoice',
					key: 'cloud.desktop.moduleDisplayNameInvoice',
				},
				description: {
					text: 'Management of Invoice',
					key: 'cloud.desktop.moduleDescriptionInvoice',
				},
				iconClass: 'ico-invoice',
				color: 4543669,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'procurement/invoice',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'fefa14c0f82d44b086139ded79dfecee',
			},
		];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations.
	 */
	public override get wizards(): IWizard[] {
		return [
			...PROCUREMENT_CONTRACT_WIZARDS,
			...PROCUREMENT_PACKAGE_WIZARDS,
			...PROCUREMENT_INVENTORY_HEADER_WIZARDS,
			...PROCUREMENT_REQUISITION_WIZARDS,
			...PROCUREMENT_RFQ_WIZARDS,
			...PROCUREMENT_PES_WIZARDS,
			...PROCUREMENT_QUOTE_WIZARDS,
			...PROCUREMENT_COMMON_WIZARDS,
			...PROCUREMENT_INVOICE_WIZARDS,
			...PROCUREMENT_STOCK_WIZARDS,
			...PROCUREMENT_ORDERPROPOSALS_WIZARDS,
			...PROCUREMENT_PRICECOMPARISION_WIZARDS,
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('contract', () => import('@libs/procurement/contract').then((module) => module.ProcurementContractModule)),
			ContainerModuleRouteInfo.create('ticketsystem', () => import('@libs/procurement/ticketsystem').then((module) => module.ProcurementTicketsystemModule)),
			ContainerModuleRouteInfo.create('rfq', () => import('@libs/procurement/rfq').then((module) => module.ProcurementRfqModule)),
			ContainerModuleRouteInfo.create('package', () => import('@libs/procurement/package').then((module) => module.ProcurementPackageModule)),
			ContainerModuleRouteInfo.create('requisition', () => import('@libs/procurement/requisition').then((module) => module.ProcurementRequisitionModule)),
			ContainerModuleRouteInfo.create('quote', () => import('@libs/procurement/quote').then((module) => module.ProcurementQuoteModule)),
			ContainerModuleRouteInfo.create('stock', () => import('@libs/procurement/stock').then((module) => module.ProcurementStockModule)),
			ContainerModuleRouteInfo.create('pricecomparison', () => import('@libs/procurement/pricecomparison').then((module) => module.ProcurementPricecomparisonModule)),
			ContainerModuleRouteInfo.create('inventory', () => import('@libs/procurement/inventory').then((module) => module.ProcurementInventoryModule)),
			ContainerModuleRouteInfo.create('orderproposals', () => import('@libs/procurement/orderproposals').then((module) => module.ProcurementOrderproposalsModule)),
			ContainerModuleRouteInfo.create('pes', () => import('@libs/procurement/pes').then((module) => module.ProcurementPesModule)),
			ContainerModuleRouteInfo.create('invoice', () => import('@libs/procurement/invoice').then((module) => module.ProcurementInvoiceModule)),
		];
	}

	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
