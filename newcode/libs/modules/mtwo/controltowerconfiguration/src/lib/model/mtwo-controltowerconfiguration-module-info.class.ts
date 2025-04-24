/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MTWO_CONTROL_TOWER_CONFIGURATION_ENTITY_INFO } from './mtwo-control-tower-configuration-entity-info.model';
import { MTWO_CONTROL_TOWER_CONFIGURATION_ITEM_ENTITY_INFO } from './mtwo-control-tower-configuration-item-entity-info.model';
import { MTWO_CONTROL_TOWER_CONFIGURATION_CLERK_ENTITY_INFO } from './mtwo-control-tower-configuration-clerk-entity-info.model';
import { MTWO_CONTROL_TOWER_CONFIGURATION_PERMISSIONS_ENTITY_INFO } from './mtwo-controltower-configuration-permissions-entity-info.model';

/**
 * The module info object for the `mtwo.controltowerconfiguration` content module.
 */
export class MtwoControltowerConfigurationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: MtwoControltowerConfigurationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): MtwoControltowerConfigurationModuleInfo {
		if (!this._instance) {
			this._instance = new MtwoControltowerConfigurationModuleInfo();
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
		return 'mtwo.controltowerconfiguration';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Mtwo.Controltowerconfiguration';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ MTWO_CONTROL_TOWER_CONFIGURATION_ENTITY_INFO, MTWO_CONTROL_TOWER_CONFIGURATION_ITEM_ENTITY_INFO, MTWO_CONTROL_TOWER_CONFIGURATION_CLERK_ENTITY_INFO, MTWO_CONTROL_TOWER_CONFIGURATION_PERMISSIONS_ENTITY_INFO];
	}

	 /**
     * Loads the translation file used for control tower configuration
     */
	 public override get preloadedTranslations(): string[] {
        return [this.internalModuleName, 'basics.company','basics.clerk', 'usermanagement.right'];
    }
}
