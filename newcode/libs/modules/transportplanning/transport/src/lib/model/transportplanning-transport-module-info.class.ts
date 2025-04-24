/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TRANSPORTPLANNING_TRANSPORT_ENTITY_INFO } from './transportplanning-transport-entity-info.model';

/**
 * The module info object for the `transportplanning.transport` content module.
 */
export class TransportplanningTransportModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TransportplanningTransportModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TransportplanningTransportModuleInfo {
		if (!this._instance) {
			this._instance = new TransportplanningTransportModuleInfo();
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
		return 'transportplanning.transport';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Transportplanning.Transport';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TRANSPORTPLANNING_TRANSPORT_ENTITY_INFO, ];
	}
}
