/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_BILLING_SCHEMA_ENTITY_INFO } from './entity-info/basics-billing-schema-entity-info.model';
import { BASICS_BILLING_SCHEMA_DETAILS_ENTITY_INFO } from './entity-info/basics-billing-schema-details-entity-info.model';

/**
 * The module info object for the `basics.billingschema` content module.
 */
export class BasicsBillingschemaModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsBillingschemaModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsBillingschemaModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsBillingschemaModuleInfo();
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
		return 'basics.billingschema';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Billingschema';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ BASICS_BILLING_SCHEMA_ENTITY_INFO, BASICS_BILLING_SCHEMA_DETAILS_ENTITY_INFO ];
	}

	/**
     * Loads the translation file used for billingSchema
     */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	/**
	 * Returns the translation container UUID for the billing schema module.
	 */
	protected override get translationContainer(): string | undefined {
		return '8a2267364c8147d68c38553a8652aed4';
	}
}
