/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MODEL_MAIN_OBJECT_ENTITY_INFO } from './model-main-object-entity-info.model';
import { MODEL_MAIN_PROPERTY_ENTITY_INFO } from './model-main-property-entity-info.model';
import {MODEL_MAIN_OBJECT_SET_ENTITY_INFO } from './../model/model-main-object-set-entity-info.model';
import { MODEL_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO } from './model-main-object-set2-object-entity-info.model';
import { MODEL_MAIN_OBJECT2_OBJECT_SET_ENTITY_INFO } from './model-main-object2-object-set-entity-info.model';
import { MODEL_MAIN_OBJECT2_LOCATION_ENTITY_INFO } from './model-main-object2-location-entity-info.model';
// import { MODEL_MAIN_VIEWPOINT_ENTITY_INFO } from '../viewpoint/model/model-main-viewpoint-entity-info.model';

/**
 * The module info object for the `model.main` content module.
 */
export class ModelMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelMainModuleInfo {
		if (!this._instance) {
			this._instance = new ModelMainModuleInfo();
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
		return 'model.main';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Model.Main';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ MODEL_MAIN_OBJECT_ENTITY_INFO, MODEL_MAIN_OBJECT_SET_ENTITY_INFO, MODEL_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO, MODEL_MAIN_OBJECT2_OBJECT_SET_ENTITY_INFO, MODEL_MAIN_OBJECT2_LOCATION_ENTITY_INFO, MODEL_MAIN_PROPERTY_ENTITY_INFO,];
	}
}
