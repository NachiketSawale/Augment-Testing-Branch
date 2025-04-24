/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PpsMaterialCatalogDataService } from '../services/material-catalog/material-catalog-data.service';
import { PPS_MATERIAL_CATALOG_ENTITY_INFO } from '../services/material-catalog/material-catalog-entity-info.model';
import { PPS_MATERIAL_GROUP_ENTITY_INFO } from '../services/material-group/material-group-entity-info.model';
import { PPS_CAD_TO_MATERIAL_ENTITY_INFO } from './pps-cad-to-material-entity-info.model';
import { PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_ENTITY_INFO } from './pps-material-to-mdl-product-type-entity-info.model';
import { PPS_MATERIAL_RECORD_ENTITY_INFO } from './material-record-entity-info.model';
import { PPS_MATERIAL_SUMMARIZED_ENTITY_INFO } from './pps-material-summarized-entity-info.model';
import { PPS_MATERIAL_EVENTTYPE_ENTITY_INFO } from './pps-material-eventtype-entity-info.model';

/**
 * The module info object for the `productionplanning.ppsmaterial` content module.
 */
export class ProductionplanningPpsmaterialModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningPpsmaterialModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningPpsmaterialModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningPpsmaterialModuleInfo();
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
		return 'productionplanning.ppsmaterial';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Ppsmaterial';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PPS_MATERIAL_RECORD_ENTITY_INFO, // for multiple root containers, PPS_MATERIAL_RECORD_ENTITY_INFO should be the first one
			PPS_CAD_TO_MATERIAL_ENTITY_INFO,
			PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_ENTITY_INFO,
			PPS_MATERIAL_CATALOG_ENTITY_INFO,
			PPS_MATERIAL_GROUP_ENTITY_INFO,
			PPS_MATERIAL_SUMMARIZED_ENTITY_INFO,
			PPS_MATERIAL_EVENTTYPE_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.material', 'basics.materialcatalog', 'resource.type', 'resource.master', 'basics.site'];
	}

	public override initializeModule(injector: Injector): void {
		super.initializeModule(injector);
		const materialCatalogDataService = injector.get(PpsMaterialCatalogDataService);
		materialCatalogDataService.load().then(() => {
			materialCatalogDataService.goToFirst();
		});
	}
}
