/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_ORDER_PROPOSALS_GRID_ENTITY_INFO } from './procurement-order-proposals-grid-entity-info.model';

/**
 * The module info object for the `procurement.orderproposals` content module.
 */
export class ProcurementOrderproposalsModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProcurementOrderproposalsModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementOrderproposalsModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementOrderproposalsModuleInfo();
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
		return 'procurement.orderproposals';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Orderproposals';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ PROCUREMENT_ORDER_PROPOSALS_GRID_ENTITY_INFO, ];
	}

	/**
	 * Loads the translation file used for procurement order proposal
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'procurement.orderproposals',
			'procurement.stock',
			'cloud.common'
		]);
	}
}
