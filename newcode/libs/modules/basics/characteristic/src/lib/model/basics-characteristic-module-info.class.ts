/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { BASICS_CHARACTERISTIC_GROUP_ENTITY_INFO } from './entity-info/basics-characteristic-group-entity-info.model';
import { BASICS_CHARACTERISTIC_ENTITY_INFO } from './entity-info/basics-characteristic-entity-info.model';
import { BASICS_CHARACTERISTIC_SECTION_ENTITY_INFO } from './entity-info/basics-characteristic-section-entity-info.model';
import { BASICS_CHARACTERISTIC_USED_IN_COMPANY_ENTITY_INFO } from './entity-info/basics-characteristic-used-in-company-entity-info.model';
import { BASICS_CHARACTERISTIC_AUTOMATIC_ASSIGNMENT_ENTITY_INFO } from './entity-info/basics-characteristic-automatic-assignment-entity-info.model';
import { BASICS_CHARACTERISTIC_DISCRETE_VALUE_ENTITY_INFO } from './entity-info/basics-characteristic-discrete-value-entity-info.model';
import { BASICS_CHARACTERISTIC_CHAIN_CHARACTERISTIC_ENTITY_INFO } from './entity-info/basics-characteristic-chain-chatacteristic-entity-info.model';

export class BasicsCharacteristicModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsCharacteristicModuleInfo;

	public static get instance(): BasicsCharacteristicModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsCharacteristicModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.characteristic';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_CHARACTERISTIC_GROUP_ENTITY_INFO,
			BASICS_CHARACTERISTIC_SECTION_ENTITY_INFO,
			BASICS_CHARACTERISTIC_ENTITY_INFO,
			BASICS_CHARACTERISTIC_USED_IN_COMPANY_ENTITY_INFO,
			BASICS_CHARACTERISTIC_AUTOMATIC_ASSIGNMENT_ENTITY_INFO,
			BASICS_CHARACTERISTIC_DISCRETE_VALUE_ENTITY_INFO,
			BASICS_CHARACTERISTIC_CHAIN_CHARACTERISTIC_ENTITY_INFO,
		];
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
		return '984f63b8d8ef438e8590613e38da3ab2';
	}
}
