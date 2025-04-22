/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_INVENTORY_HEADER_GRID_ENTITY_INFO } from './procurement-inventory-header-grid-entity-info.model';
import { INVENTORY_DOCUMENT_ENTITY_INFO } from './inventory-document-entity-info.model';
import { PROCUREMENT_INVENTORY_GRID_ENTITY_INFO } from './procurement-inventory-grid-entity-info.model';

/**
 * The module info object for the `procurement.inventory` content module.
 */
export class ProcurementInventoryModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProcurementInventoryModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementInventoryModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementInventoryModuleInfo();
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
		return 'procurement.inventory';
	}
	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Inventory';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PROCUREMENT_INVENTORY_HEADER_GRID_ENTITY_INFO, INVENTORY_DOCUMENT_ENTITY_INFO, PROCUREMENT_INVENTORY_GRID_ENTITY_INFO,];
	}

	/**
	 * Loads the translation file used for procurement inventory
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'documents.project','project.stock', 'basics.customize', 'cloud.common'];
	}

}
