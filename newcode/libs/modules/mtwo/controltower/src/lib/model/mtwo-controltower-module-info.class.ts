/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MTWO_CONTROL_TOWER_USER_ENTITY_INFO } from './mtwo-control-tower-user-entity-info.model';
import { MTWO_CONTROL_TOWER_REPORT_ENTITY_INFO } from './mtwo-control-tower-report-entity-info.model';
import { MTWO_CONTROL_TOWER_PRO_REPORTS_ENTITY_INFO } from './mtwo-control-tower-pro-reports-entity-info.model';

/**
 * The module info object for the `mtwo.controltower` content module.
 */
export class MtwoControltowerModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: MtwoControltowerModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): MtwoControltowerModuleInfo {
		if (!this._instance) {
			this._instance = new MtwoControltowerModuleInfo();
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
		return 'mtwo.controltower';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Mtwo.Controltower';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ MTWO_CONTROL_TOWER_USER_ENTITY_INFO, MTWO_CONTROL_TOWER_REPORT_ENTITY_INFO, MTWO_CONTROL_TOWER_PRO_REPORTS_ENTITY_INFO];
	}

	/**
     * Loads the translation file used for control tower
     */
	public override get preloadedTranslations(): string[] {
        return [this.internalModuleName, 'basics.company', 'mtwo.controltowerconfiguration', 'cloud.common'];
    }
}
