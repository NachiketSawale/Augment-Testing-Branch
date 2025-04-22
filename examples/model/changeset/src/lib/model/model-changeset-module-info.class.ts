/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ModelChangeSetEntityInfo } from './model-change-set-entity-info.model';

/**
 * The module info object for the `model.changeset` content module.
 */
export class ModelChangesetModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelChangesetModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelChangesetModuleInfo {
		if (!this._instance) {
			this._instance = new ModelChangesetModuleInfo();
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
		return 'model.changeset';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ModelChangeSetEntityInfo,];
	}
}
