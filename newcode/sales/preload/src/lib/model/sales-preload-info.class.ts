/*
 * Copyright(c) RIB Software GmbH
 */

import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { SALES_BILLING_WIZARDS } from './wizards/billing-wizards';
import { SALES_BID_WIZARDS } from './wizards/bid-wizards';

/**
 * The module info object for the `sales` preload module.
 */
export class SalesPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: SalesPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SalesPreloadInfo {
		if (!this._instance) {
			this._instance = new SalesPreloadInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes a new instance.
	 * The purpose of this declaration is to make the constructor private and ensure the class is a singleton.
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'sales';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'sales.contract',
				tileSize: TileSize.Small,
				color: 11648547,
				opacity: 1,
				iconClass: 'ico-sales-contract',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Contract',
					key: 'cloud.desktop.moduleDisplayNameSalesContract',
				},
				description: {
					text: 'Sales Contract',
					key: 'cloud.desktop.moduleDescriptionSalesContract',
				},
				defaultGroupId: TileGroup.Sales,
				defaultSorting: 1,
				permissionGuid: 'eb0b76c278ca42b294611cceaae48907',
				targetRoute: 'sales/contract',
			},
			{
				id: 'sales.wip',
				tileSize: TileSize.Small,
				color: 11648547,
				opacity: 0,
				iconClass: 'ico-sales-wip',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'WIP',
					key: 'cloud.desktop.moduleDisplayNameWip',
				},
				description: {
					text: 'Sales wip',
					key: 'cloud.desktop.moduleDescriptionSalesWip',
				},
				defaultGroupId: TileGroup.Sales,
				defaultSorting: 2,
				permissionGuid: 'eb0b76c278ca42b294611cceaae48907',
				targetRoute: 'sales/wip',
			},
			{
				id: 'sales.billing',
				displayName: {
					text: 'Billing',
					key: 'cloud.desktop.moduleDisplayNameBilling',
				},
				description: {
					text: 'Sales Invoices',
					key: 'cloud.desktop.moduleDescriptionBilling',
				},
				iconClass: 'ico-sales-billing',
				color: 7897368,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'sales/billing',
				defaultGroupId: TileGroup.Sales,
				defaultSorting: 3,
				permissionGuid: '3929863f44f64dfb97cb1ff4e5b7316e',
			},
			{
				id: 'sales.bid',
				displayName: {
					text: 'Bid',
					key: 'cloud.desktop.moduleDisplayNameBid',
				},
				description: {
					text: 'Management of Bid',
					key: 'cloud.desktop.moduleDescriptionBid',
				},
				iconClass: 'ico-sales-bid',
				color: 9805597,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'sales/bid',
				defaultGroupId: TileGroup.Sales,
				defaultSorting: 0, //TODO
				permissionGuid: 'e7bc01da74ba4d6f9adbdfc21ee7c935',
			},
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			...SALES_BILLING_WIZARDS,
			...SALES_BID_WIZARDS,
			{
				uuid: 'B812EA3D7DD64B3AA97387395D70B82D',
				name: 'Create Bill',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().createBill(context));
				},
			},
			{
				uuid: 'c3eeedbc977049b08cb321a3d574b39c',
				name: 'Create WIP',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().createWip(context));
				},
			},
			{
				uuid: '4c51d56e1f084fa99640e47df9d0cb13',
				name: 'Update Estimate',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().updatEstimate(context));
				},
			},
			{
				uuid: '9c25c7fcc5964600b0e829cda55b9e2c',
				name: 'Change Contract Status',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().changeContractStatus(context));
				},
			},
			{
				uuid: 'f7ce1de0712f45aabd838d74daed5230',
				name: 'Change Wip Status',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().changeWipStatus(context));
				},
			},
			{
				uuid: 'ca5ff47747054af3bc9c441c264f0761',
				name: 'Create Bill',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().createBill(context));
				},
			},
			{
				uuid: 'bd22d19d486848db8a628ef2c6427768',
				name: 'Change Code',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().changeCode(context));
				},
			},
			{
				uuid: '314c998a4e4048bbac900c57e56c2c5d',
				name: 'Change Code',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().changeContractCode(context));
				},
			},
			{
				uuid: 'f7ce1de0712f45aabd838d74daed5230',
				name: 'Change Wip Status',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().changeWipStatus(context));
				},
			},
			{
				uuid: 'ca5ff47747054af3bc9c441c264f0761',
				name: 'Create Bill',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().createBill(context));
				},
			},
			{
				uuid: '5d038199d29d41b4be0ba27956824e10',
				name: 'Generate Payment Schedule',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().generatePaymentSchedule(context));
				},
			},
			{
				uuid: '7e4c43416c334aeaaa17be7c702235b1',
				name: 'Generate Advance Payment Bill',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().generateAdvancePaymentBill(context));
				},
			},
			{
				uuid: '9d97cb3943864fe1a78b7d6af5e21944',
				name: 'Change Advance Line Status',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().changeAdvanceLineStatus(context));
				},
			},
			{
				uuid: '4831bd86bb1c47f79d41998976fb534b',
				name: 'Update WIP Quantities',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().updateWipQuantity(context));
				},
			},
			{
				uuid: '917973f5ff674e618235d32e10c4077d',
				name: 'Change Payment Schedule Status',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().changePaymentScheduleStatus(context));
				},
			},
			{
				uuid: '83bf7ef150a24b999652f2b21b4081cc',
				name: 'Change Contract Type/Configuration',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().changeContractConfiguration(context));
				},
			},
			{
				uuid: '248fae351d76437d80b1284306b0284e',
				name: 'Create WIP Accruals',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().createWipAccruals(context));
				},
			},
			{
				uuid: '3064f8fed2bd47189cd35a5582b2a483',
				name: 'Change Type Or Configuration',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().changeTypeOrConfig(context));
				},
			},
			{
				uuid: 'e494c864688d4d999b7032c89ee6a02c',
				name: 'Generate Bill From Payment Schedule', // TODO: Need translated text
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().generateBillFromPaymentSchedule(context));
				},
			},
			{
				uuid: 'e97fc71537d34237bc8db9486e41b571',
				name: 'Set Previous WIP',
				execute: (context) => {
					return import('@libs/sales/wip').then((module) => new module.SalesWipMainWizard().setPreviousWip(context));
				},
			},
			{
				uuid: '45da63d5abdb47d260b56d1deffcc249',
				name: 'generateTransactions',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().generateTransactionsForOrders(context));
				},
			},
			{
				uuid: 'c89d65f760f04970ba295a62021f2e22',
				name: 'generatePaymentScheduleFromSchedule',
				execute: (context) => {
					return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().generatePaymentScheduleFromSchedule(context));
				},
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('wip', () => import('@libs/sales/wip').then((module) => module.SalesWipModule)),
			ContainerModuleRouteInfo.create('contract', () => import('@libs/sales/contract').then((module) => module.SalesContractModule)),
			ContainerModuleRouteInfo.create('billing', () => import('@libs/sales/billing').then((module) => module.SalesBillingModule)),
			ContainerModuleRouteInfo.create('bid', () => import('@libs/sales/bid').then((module) => module.SalesBidModule)),
		];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
