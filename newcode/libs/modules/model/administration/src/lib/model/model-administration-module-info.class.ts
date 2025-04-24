/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { RootSchema } from './root-schema.class';
import { ModelAdministrationRootDataService } from '../services/model-administration-root-data.service';
import { VIEWER_SETTINGS_ENTITY_INFO } from '../viewer-settings/model/viewer-settings-entity-info.model';
import { Translatable } from '@libs/platform/common';
import { STATIC_HL_SCHEME_ENTITY_INFO } from '../hl-schemes/model/static-hl-scheme-entity-info.model';
import { STATIC_HL_ITEM_ENTITY_INFO } from '../hl-schemes/model/static-hl-item-entity-info.model';
import { DYNAMIC_HL_SCHEME_ENTITY_INFO } from '../hl-schemes/model/dyn-hl-scheme-entity-info.model';
import { DYNAMIC_HL_ITEM_ENTITY_INFO } from '../hl-schemes/model/dyn-hl-item-entity-info.model';
import { PROPERTY_KEY_TAG_CATEGORY_ENTITY_INFO } from '../property-keys/model/property-key-tag-category-entity-info.model';
import { PROPERTY_KEY_TAG_ENTITY_INFO } from '../property-keys/model/property-key-tag-entity-info.model';
import { PROPERTY_KEY_ENTITY_INFO } from '../property-keys/model/property-key-entity-info.model';
import { PROPERTY_KEY_COMPARISON_EXCLUSION_ENTITY_INFO } from '../property-keys/model/property-key-comparison-exclusion-entity-info.model';
import { DATA_TREE_ENTITY } from '../data-trees/model/data-tree-entity-info.model';
import { DATA_TREE_LEVEL_ENTITY } from '../data-trees/model/data-tree-level-entity-info.model';
import { DATA_TREE_2_MODEL_ENTITY } from '../data-trees/model/data-tree-2-model-entity-info.model';
import { DATA_TREE_NODE_ENTITY } from '../data-trees/model/data-tree-node-entity-info.model';
import { MODEL_IMPORT_PROFILE_ENTITY_INFO } from '../model-import/model/model-import-profile-entity-info.model';
import { MODEL_IMPORT_PROPERTY_KEY_RULE_ENTITY_INFO } from '../model-import/model/model-import-property-key-rule-entity-info.model';
import { MODEL_IMPORT_PROPERTY_PROCESSOR_ENTITY_INFO } from '../model-import/model/model-import-property-processor-entity-info.model';

export class ModelAdministrationModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new ModelAdministrationModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'model.administration';
	}

	public override get moduleName(): Translatable {
		return {
			key: 'cloud.desktop.moduleDisplayNameModelAdministration'
		};
	}

	private readonly rootEntityInfo = EntityInfo.create({
		entitySchema: RootSchema,
		permissionUuid: '45f90ffded3f42b1bd724aaca01f2235',
		grid: false,
		dataService: ctx => ctx.injector.get(ModelAdministrationRootDataService)
	});

	public override get entities(): EntityInfo[] {
		return [
			this.rootEntityInfo,
			VIEWER_SETTINGS_ENTITY_INFO,
			STATIC_HL_SCHEME_ENTITY_INFO,
			STATIC_HL_ITEM_ENTITY_INFO,
			DYNAMIC_HL_SCHEME_ENTITY_INFO,
			DYNAMIC_HL_ITEM_ENTITY_INFO,
			PROPERTY_KEY_TAG_CATEGORY_ENTITY_INFO,
			PROPERTY_KEY_TAG_ENTITY_INFO,
			PROPERTY_KEY_ENTITY_INFO,
			PROPERTY_KEY_COMPARISON_EXCLUSION_ENTITY_INFO,
			DATA_TREE_ENTITY,
			DATA_TREE_LEVEL_ENTITY,
			DATA_TREE_2_MODEL_ENTITY,
			DATA_TREE_NODE_ENTITY,
			MODEL_IMPORT_PROFILE_ENTITY_INFO,
			MODEL_IMPORT_PROPERTY_KEY_RULE_ENTITY_INFO,
			MODEL_IMPORT_PROPERTY_PROCESSOR_ENTITY_INFO
		];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'cloud.desktop',
			'model.viewer'
		];
	}
}
