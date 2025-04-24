/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { RFQ_HEADER_ENTITY_INFO } from './entity-info/rfq-header-entity-info.mode';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementPricecomparisonInitializeService } from '../services/initialize.service';
import { COMPARE_BOQ_ENTITY_INFO } from './entity-info/compare-boq-entity-info.mode';
import { COMPARE_ITEM_ENTITY_INFO } from './entity-info/compare-item-entity-info.mode';
import {
	HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO
} from './entity-info/historical-price-for-item-entity-info.model';
import { PRICE_COMPARISON_USER_FORM_ENTITY_INFO } from './entity-info/user-form-entity-info.model';
import { PRICE_COMPARISON_BUSINESS_PARTNER_ENTITY_INFO } from './entity-info/business-partner-entity-info.model';
import {
	PRICE_COMPARISON_PRICE_CONDITION_ENTITY_INFO
} from './entity-info/price-condition-entity-info.model';
import { PRICE_COMPARISON_BILLING_SCHEMA_ENTITY_INFO } from './entity-info/billing-schema-entity.info.model';
import { PRICE_COMPARISON_QUOTE_BY_REQUEST_ENTITY_INFO } from './entity-info/quote-by-request-entity-info.model';
import {
	PRICE_COMPARISON_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO
} from './entity-info/business-partner-evaluation-entity-info.model';
import { PRICE_COMPARISON_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/pin-board-container-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PRICE_COMPARISON_QUOTE_EVALUATION_ENTITY_INFO } from './entity-info/quote-evaluation-entity-info.model';
import { PRICE_COMPARISON_CHART_ENTITY_INFO } from './entity-info/price-comparison-chart-entity-info.model';

/**
 * The module info object for the `procurement.pricecomparison` content module.
 */
export class ProcurementPricecomparisonModuleInfo extends BusinessModuleInfoBase {
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static readonly instance = new ProcurementPricecomparisonModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.pricecomparison';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.PriceComparison';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			RFQ_HEADER_ENTITY_INFO,
			COMPARE_BOQ_ENTITY_INFO,
			COMPARE_ITEM_ENTITY_INFO,
			HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
			PRICE_COMPARISON_USER_FORM_ENTITY_INFO,
			PRICE_COMPARISON_BUSINESS_PARTNER_ENTITY_INFO,
			PRICE_COMPARISON_PRICE_CONDITION_ENTITY_INFO,
			PRICE_COMPARISON_BILLING_SCHEMA_ENTITY_INFO,
			PRICE_COMPARISON_QUOTE_BY_REQUEST_ENTITY_INFO,
			PRICE_COMPARISON_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO,
			PRICE_COMPARISON_QUOTE_EVALUATION_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'procurement.common',
			'procurement.rfq',
			'procurement.quote',
			'businesspartner.main',
			'boq.main',
			'cloud.common',
			'basics.customize',
			'basics.material',
			'basics.shared',
			'procurement.pricecomparison',
		]);
	}

	public override async prepareModule(context: IInitializationContext): Promise<void> {
		await super.prepareModule(context);
		return context.injector.get(ProcurementPricecomparisonInitializeService).prepareData();
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			PRICE_COMPARISON_PIN_BOARD_CONTAINER_DEFINITION,
			PRICE_COMPARISON_CHART_ENTITY_INFO
		]);
	}
}
