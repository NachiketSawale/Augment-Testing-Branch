/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MODEL_MAP_ENTITY_INFO } from './model-map-entity-info.model';
import { MODEL_MAP_AREA_ENTITY_INFO } from './model-map-area-entity-info.model';
import { MODEL_MAP_LEVEL_ENTITY_INFO } from './model-map-level-entity-info.model';
import { MODEL_MAP_POLYGON_ENTITY_INFO } from './model-map-polygon-entity-info.model';

/**
 * The module info object for the `model.map` content module.
 */
export class ModelMapModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelMapModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelMapModuleInfo {
		if (!this._instance) {
			this._instance = new ModelMapModuleInfo();
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
		return 'model.map';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [MODEL_MAP_ENTITY_INFO, MODEL_MAP_AREA_ENTITY_INFO, MODEL_MAP_LEVEL_ENTITY_INFO, MODEL_MAP_POLYGON_ENTITY_INFO,];
	}
}
