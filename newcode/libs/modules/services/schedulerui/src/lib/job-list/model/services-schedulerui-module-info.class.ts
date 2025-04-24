/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { SERVICES_SCHEDULER_UIJOB_ENTITY_INFO } from './services-scheduler-uijob-entity-info.model';

/**
 * The module info object for the `services.schedulerui` content module.
 */
export class ServicesScheduleruiModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ServicesScheduleruiModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ServicesScheduleruiModuleInfo {
		if (!this._instance) {
			this._instance = new ServicesScheduleruiModuleInfo();
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
		return 'services.schedulerui';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Services.Schedulerui';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ SERVICES_SCHEDULER_UIJOB_ENTITY_INFO, ];
	}
}
