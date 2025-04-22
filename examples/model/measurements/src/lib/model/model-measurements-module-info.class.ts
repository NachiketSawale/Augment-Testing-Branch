/*
 * Copyright(c) RIB Software GmbH
 */

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ModelMeasurementEntityInfo } from './entities/model-measurement-entity-info.model';
import { ModelMeasurementPointEntityInfo } from './entities/model-measurement-point-entity-info.model';

/**
 * The module info object for the `model.measurements` content module.
 */
export class ModelMeasurementsModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelMeasurementsModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelMeasurementsModuleInfo {
		if (!this._instance) {
			this._instance = new ModelMeasurementsModuleInfo();
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
		return 'model.measurements';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Model.Measurements';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ModelMeasurementEntityInfo,
			ModelMeasurementPointEntityInfo,
		];
	}
}
