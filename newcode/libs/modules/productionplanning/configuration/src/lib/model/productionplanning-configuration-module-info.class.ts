/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { CONFIGURATION_EVENTTYPE2RESTYPE_ENTITY_INFO } from './configuration-eventtype2restype-entity-info.model';
import { CONFIGURATION_EVENT_TYPE_ENTITY_INFO } from './configuration-event-type-entity-info.model';
import { CONFIGURATION_ENGTYPE2EVENTTYPE_ENTITY_INFO } from './configuration-engtype2eventtype-entity-info.model';
import { CONFIGURATION_ENGTYPE_ENTITY_INFO } from './configuration-engtype-entity-info.model';
import { CONFIGURATION_EVENT_TYPE_SLOT_ENTITY_INFO } from './configuration-event-type-slot-entity-info.model';
import { CONFIGURATION_EVENT_TYPE_QTY_SLOT_ENTITY_INFO } from './configuration-event-type-qty-slot-entity-info.model';
import { CONFIGURATION_CLERK_ROLE_SLOT_ENTITY_INFO } from './configuration-clerk-role-slot-entity-info.model';
import { CONFIGURATION_PLANNED_QUANTITY_SLOT_ENTITY_INFO } from './configuration-planned-quantity-slot-entity-info.model';
import { CONFIGURATION_PHASE_DATE_SLOT_ENTITY_INFO } from './configuration-phase-date-slot-entity-info.model';
import { CONFIGURATION_LOG_CONFIG_ENTITY_INFO } from './configuration-log-config-entity-info.model';
import { EXTERNAL_CONFIGURATION_ENTITY_INFO } from './external-configuration-entity-info.model';
import { CONFIGURATION_UPSTREAM_ITEM_TEMPLATE_ENTITY_INFO } from './configuration-upstream-item-template-entity-info.model';

/**
 * The module info object for the `productionplanning.configuration` content module.
 */
export class ProductionplanningConfigurationModuleInfo extends BusinessModuleInfoBase {
	private constructor() {
		super();
	}

	private static _instance?: ProductionplanningConfigurationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningConfigurationModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningConfigurationModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'productionplanning.configuration';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Configuration';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			CONFIGURATION_EVENT_TYPE_ENTITY_INFO,
			CONFIGURATION_UPSTREAM_ITEM_TEMPLATE_ENTITY_INFO,
			CONFIGURATION_PLANNED_QUANTITY_SLOT_ENTITY_INFO,
			CONFIGURATION_PHASE_DATE_SLOT_ENTITY_INFO,
			CONFIGURATION_LOG_CONFIG_ENTITY_INFO,
			CONFIGURATION_EVENTTYPE2RESTYPE_ENTITY_INFO,
			CONFIGURATION_ENGTYPE2EVENTTYPE_ENTITY_INFO,
			CONFIGURATION_ENGTYPE_ENTITY_INFO,
			CONFIGURATION_EVENT_TYPE_SLOT_ENTITY_INFO,
			CONFIGURATION_EVENT_TYPE_QTY_SLOT_ENTITY_INFO,
			CONFIGURATION_CLERK_ROLE_SLOT_ENTITY_INFO,
			EXTERNAL_CONFIGURATION_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'productionplanning.common',
			'resource.master',
			'productionplanning.item',
			'cloud.common',
			'resource.type',
			'basics.company',
			'basics.common',
			'productionplanning.formulaconfiguration',
		];
	}
}
