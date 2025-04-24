/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { Translatable } from '@libs/platform/common';

import { PPS_ACCOUNTING_RULESET_ENTITY_INFO } from './pps-accounting-ruleset-entity-info.model';
import { PPS_ACCOUNTING_RULE_ENTITY_INFO } from './pps-accounting-rule-entity-info.model';
import { PPS_ACCOUNTING_RESULT_ENTITY_INFO } from './pps-accounting-result-entity-info.model';

/**
 * The module info object for the `productionplanning.accounting` content module.
 */
export class ProductionplanningAccountingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningAccountingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningAccountingModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningAccountingModuleInfo();
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
		return 'productionplanning.accounting';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.Accounting';
	}


	public override get moduleName(): Translatable {
		return { key: 'cloud.desktop.moduleDisplayNamePpsAccounting' };
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ PPS_ACCOUNTING_RULESET_ENTITY_INFO, PPS_ACCOUNTING_RULE_ENTITY_INFO, PPS_ACCOUNTING_RESULT_ENTITY_INFO, ];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'basics.material',
			'productionplanning.common',
			'productionplanning.ppsmaterial',
		];
	}
}
