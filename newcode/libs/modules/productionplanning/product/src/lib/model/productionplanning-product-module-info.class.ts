/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { Translatable } from '@libs/platform/common';

import { PRODUCTIONPLANNING_PRODUCT_ENTITY_INFO } from './pps-product-entity-info.model';
import { PPS_PRODUCT_RACK_ASSIGNMENT_ENTITY_INFO } from './pps-product-rack-assignment-entity-info.model';
import { PPS_ENGINEER_PRODUCT_COMPONENT_ENTITY_INFO } from './pps-product-component-entity-info.model';
import { PPS_PRODUCT_USER_FORM_ENTITY_INFO } from './pps-product-user-form-entity-info.model';
import { PPS_PRODUCT_PHASE_ENTITY_INFO } from './pps-product-phase-entity-info.model';
import { PPS_PRODUCT_PHASE_REQUIREMENT_ENTITY_INFO } from './pps-product-phase-req-entity-info.model';
import { PPS_PRODUCT_EVENT_ENTITY_INFO } from './pps-product-event-entity-info.model';
import { PPS_PRODUCT_CHARACTERISTIC_ENTITY_INFO } from './pps-product-characteristic-entity-info.model';
import { PPS_PRODUCT_CHARACTERISTIC2_ENTITY_INFO } from './pps-product-characteristic2-entity-info.model';
import { PPS_PRODUCT_GENERIC_DOCUMENT_ENTITY_INFO } from './pps-product-generic-document-entity-info.model';
import { PPS_PRODUCT_GENERIC_DOCUMENT_REVISION_ENTITY_INFO } from './pps-product-generic-document-revision-entity-info.model';
import {PPS_CUTTING_PRODUCT_V_ENTITY_INFO} from './pps-product-cutting-entity-info.model';

/**
 * The module info object for the `productionplanning.product` content module.
 */
export class ProductionplanningProductModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningProductModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningProductModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningProductModuleInfo();
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
		return 'productionplanning.product';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.Product';
	}

	public override get moduleName(): Translatable {
		return { key: 'cloud.desktop.moduleDisplayNamePPSProduct' };
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PRODUCTIONPLANNING_PRODUCT_ENTITY_INFO,
			PPS_PRODUCT_RACK_ASSIGNMENT_ENTITY_INFO,
			PPS_ENGINEER_PRODUCT_COMPONENT_ENTITY_INFO,
			PPS_PRODUCT_USER_FORM_ENTITY_INFO,
			PPS_PRODUCT_PHASE_ENTITY_INFO,
			PPS_PRODUCT_PHASE_REQUIREMENT_ENTITY_INFO,
			PPS_PRODUCT_EVENT_ENTITY_INFO,
			PPS_PRODUCT_CHARACTERISTIC_ENTITY_INFO,
			PPS_PRODUCT_CHARACTERISTIC2_ENTITY_INFO,
			PPS_PRODUCT_GENERIC_DOCUMENT_ENTITY_INFO,
			PPS_PRODUCT_GENERIC_DOCUMENT_REVISION_ENTITY_INFO,
			PPS_CUTTING_PRODUCT_V_ENTITY_INFO
		];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'productionplanning.common',
			'productionplanning.drawing', // for translation of title of generic document(revision)
			'productionplanning.producttemplate', // for translation of title of generic document(revision)
		];
	}
}
