/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_ENTITY_INFO } from './controlling-configuration-column-definition-entity-info.model';
import {
	CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_ENTITY_INFO
} from './controlling-configuration-formula-definition-entity-info.model';
import { CONTROLLING_CONFIGURATION_CHART_ENTITY_INFO } from './controlling-configuration-chart-entity-info.model';


/**
 * The module info object for the `controlling.configuration` content module.
 */
export class ControllingConfigurationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingConfigurationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingConfigurationModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingConfigurationModuleInfo();
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
		return 'controlling.configuration';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Configuration';
	}

	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common', 'basics.common'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_ENTITY_INFO,
			CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_ENTITY_INFO,
			CONTROLLING_CONFIGURATION_CHART_ENTITY_INFO
		];
	}

	/**
	 * Returns the translation container UUID for the controlling configuration module.
	 */
	protected override get translationContainer(): string | undefined {
		return '5b685541fdd946038b00d660a0718f01';
	}
}
