/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';
import { LOGISTIC_PRICE_CONDITION_ENTITY_INFO } from './logistic-price-condition-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_ITEM_ENTITY_INFO } from './logistic-price-condition-item-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_PLANT_COST_CODE_ENTITY_INFO } from './logistic-price-condition-plant-cost-code-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_MATERIAL_PRICE_ENTITY_INFO } from './logistic-price-condition-material-price-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_COST_CODE_RATE_ENTITY_INFO } from './logistic-price-condition-cost-code-rate-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_SUNDRY_SERVICE_PRICE_ENTITY_INFO } from './logistic-price-condition-sundry-service-price-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_PLANT_PRICE_ENTITY_INFO } from './logistic-price-condition-plant-price-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_MATERIAL_CATALOG_PRICE_ENTITY_INFO } from './logistic-price-condition-material-catalog-price-entity-info.model';
import { LOGISTIC_PRICE_CONDITION_EQUIPMENT_CATALOG_PRICE_ENTITY_INFO } from './logistic-price-condition-equipment-catalog-price-entity-info.model';

/**
 * The module info object for the `logistic.pricecondition` content module.
 */
export class LogisticPriceconditionModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: LogisticPriceconditionModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): LogisticPriceconditionModuleInfo {
		if (!this._instance) {
			this._instance = new LogisticPriceconditionModuleInfo();
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
		return 'logistic.pricecondition';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ LOGISTIC_PRICE_CONDITION_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_ITEM_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_PLANT_COST_CODE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_MATERIAL_PRICE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_COST_CODE_RATE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_SUNDRY_SERVICE_PRICE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_PLANT_PRICE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_MATERIAL_CATALOG_PRICE_ENTITY_INFO,
			LOGISTIC_PRICE_CONDITION_EQUIPMENT_CATALOG_PRICE_ENTITY_INFO, ];
	}

	public override get preloadedTranslations(): string[] {
		return [
			this.internalModuleName, 'cloud.common', 'basics.customize', 'ui.business-base'
		];
	}

}
