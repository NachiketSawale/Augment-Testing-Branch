/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_STOCK_HEADER_ENTITY_INFO } from './entity-info/procurement-stock-header-entity-info.model';
import { PROCUREMENT_STOCK_TOTAL_ENTITY_INFO } from './entity-info/procurement-stock-total-entity-info.model';
import { Injector } from '@angular/core';
import { ProcurementStockHeaderDataService } from '../services/procurement-stock-header-data.service';
import { PROCUREMENT_STOCK_DOWN_TIME_ENTITY_INFO } from './entity-info/procurement-stock-down-time-entity-info.model';
import { PROCUREMENT_STOCK_TOTAL_RECONCILIATION_ENTITY_INFO } from './entity-info/procurement-stock-total-reconciliation-entity-info.model';
import { PROCUREMENT_STOCK_ACCRUAL_ENTITY_INFO } from './entity-info/procurement-stock-accrual-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROCUREMENT_STOCK_RECONCILIATION2_ENTITY_INFO } from './entity-info/procurement-stock-reconciliation2-entity-info.model';
import { PROCUREMENT_STOCK_TRANSACTION_ENTITY_INFO } from './entity-info/procurement-stock-transaction-entity-info.model';
import { PROCUREMENT_STOCK_ITEM_INFO_ENTITY_INFO } from './entity-info/procurement-stock-item-info-entity-info.model';

/**
 * The module info object for the `procurement.stock` content module.
 */
export class ProcurementStockModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProcurementStockModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementStockModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementStockModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.stock';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Stock';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_STOCK_TOTAL_ENTITY_INFO,
			PROCUREMENT_STOCK_HEADER_ENTITY_INFO,
			PROCUREMENT_STOCK_DOWN_TIME_ENTITY_INFO,
			PROCUREMENT_STOCK_ACCRUAL_ENTITY_INFO,
			PROCUREMENT_STOCK_TRANSACTION_ENTITY_INFO,
			PROCUREMENT_STOCK_ITEM_INFO_ENTITY_INFO
		];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'basics.material',
			'project.stock',
			'basics.customize',
			'procurement.common',
			'procurement.pes',
			'procurement.orderproposals',
			'procurement.invoice'
		];
	}

	/**
	 * This method is invoked when a user enters the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		const prcStockHeaderDataService = injector.get(ProcurementStockHeaderDataService);
		prcStockHeaderDataService.load().then(() => {
			prcStockHeaderDataService.goToFirst();
		});
	}
	/**
	 * This method overrides the base class implementation to include a new container definition
	 * @return An array of ContainerDefinition objects
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([PROCUREMENT_STOCK_RECONCILIATION2_ENTITY_INFO, PROCUREMENT_STOCK_TOTAL_RECONCILIATION_ENTITY_INFO]);
	}
}
