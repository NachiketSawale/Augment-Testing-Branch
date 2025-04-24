/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MODEL_CHANGE_ENTITY_INFO } from './model-change-entity-info.model';

/**
 * The module info object for the `model.change` content module.
 */
export class ModelChangeModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelChangeModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelChangeModuleInfo {
		if (!this._instance) {
			this._instance = new ModelChangeModuleInfo();
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
		return 'model.change';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ MODEL_CHANGE_ENTITY_INFO, ];
	}
}
