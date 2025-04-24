/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { CLOUD_TRANSLATION_RESOURCE_ENTITY_INFO } from '../resource/model/cloud-translation-resource-entity-info.model';

import { CLOUD_TRANSLATION_TRANSLATION_ENTITY_INFO } from '../translation/model/cloud-translation-translation-entity-info.model';
import { CLOUD_TRANSLATION_LANGUAGE_ENTITY_INFO } from '../language/model/cloud-translation-language-entity-info.model';
import { CLOUD_TRANSLATION_SOURCE_ENTITY_INFO } from '../source/model/cloud-translation-source-entity-info.model';

/**
 * The module info object for the `cloud.translation` content module.
 */
export class CloudTranslationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: CloudTranslationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): CloudTranslationModuleInfo {
		if (!this._instance) {
			this._instance = new CloudTranslationModuleInfo();
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
		return 'cloud.translation';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [CLOUD_TRANSLATION_RESOURCE_ENTITY_INFO, CLOUD_TRANSLATION_TRANSLATION_ENTITY_INFO, CLOUD_TRANSLATION_LANGUAGE_ENTITY_INFO, CLOUD_TRANSLATION_SOURCE_ENTITY_INFO];
	}
}
