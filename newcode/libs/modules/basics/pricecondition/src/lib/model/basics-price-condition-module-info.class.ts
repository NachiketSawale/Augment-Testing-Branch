/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_PRICE_CONDITION_ENTITY_INFO } from '../price-condition/basics-price-condition-entity-info.model';
import { BASICS_PRICE_CONDITION_DETAIL_ENTITY_INFO } from '../detail/basics-price-condition-detail-entity-info.model';

/**
 * Basics Price Condition Module Info
 */
export class BasicsPriceConditionModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsPriceConditionModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Loads the translation file used for Price Condition
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'basics.costcodes',
			'basics.customize'
		];
	}

	public override get internalModuleName(): string {
		return 'basics.pricecondition';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.PriceCondition';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_PRICE_CONDITION_ENTITY_INFO,
			BASICS_PRICE_CONDITION_DETAIL_ENTITY_INFO
		];
	}

	/**
	 * Returns the UUID of the translation container for the basics price condition module.
	 */
    protected override get translationContainer(): string | undefined {
        return '8c1c67b130914c1285b9d0dd7a2145ca';

	}

}
