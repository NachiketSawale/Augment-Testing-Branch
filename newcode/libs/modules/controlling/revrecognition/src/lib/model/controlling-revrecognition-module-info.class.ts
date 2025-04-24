/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { REVENUE_RECOGNITION_ENTITY_INFO } from '../revenue-recognition/revenue-recognition-entity-info.model';
import { REVENUE_RECOGNITION_ITEM_E2C_ENTITY_INFO } from '../estimate-to-complete/revenue-recognition-e2c-entity-info.model';
import { REVENUE_RECOGNITION_ITEM_ENTITY_INFO } from '../item/revenue-recognition-item-entity-info.model';
import { REVENUE_RECOGNITION_ACCRUAL_ENTITY_INFO } from '../accrual/revenue-recognition-accrual-entity-info.model';
import { REVENUE_RECOGNITION_CHARACTERISTIC_ENTITY_INFO } from '../characteristic/revenue-recognition-characteristic-entity-info.model';
import { REVENUE_RECOGNITION_DOCUMENT_ENTITY_INFO } from '../document/revenue-recognition-document-entity-info.model';

/**
 * The module info object for the `controlling.revrecognition` content module.
 */
export class ControllingRevrecognitionModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingRevrecognitionModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingRevrecognitionModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingRevrecognitionModuleInfo();
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
		return 'controlling.revrecognition';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Revrecognition';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [REVENUE_RECOGNITION_ENTITY_INFO, REVENUE_RECOGNITION_ITEM_ENTITY_INFO, REVENUE_RECOGNITION_ITEM_E2C_ENTITY_INFO, REVENUE_RECOGNITION_ACCRUAL_ENTITY_INFO, REVENUE_RECOGNITION_CHARACTERISTIC_ENTITY_INFO, REVENUE_RECOGNITION_DOCUMENT_ENTITY_INFO];
	}
}
