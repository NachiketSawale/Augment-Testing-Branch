/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	createLookup,
	FieldType
} from '@libs/ui/common';
import {
	ENTITY_DEFAULT_GROUP_ID,
	EntityInfo
} from '@libs/ui/business-base';
import { ModelAdministrationPropertyKeyTagDataService } from '../services/property-key-tag-data.service';
import { IPropertyKeyTagEntity } from './entities/property-key-tag-entity.interface';
import { ModelAdministrationPropertyKeyTagBehavior } from '../behaviors/property-key-tag-behavior.service';
import { ModelAdministrationPropertyKeyTagCategoryLookupDataService } from '../services/property-key-tag-category-lookup-data.service';

export const PROPERTY_KEY_TAG_ENTITY_INFO = EntityInfo.create<IPropertyKeyTagEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'PropertyKeyTagDto'
	},
	permissionUuid: '7cfd83a5ad6b4a988250819559936199',
	grid: {
		title: { key: 'model.administration.propertyKeys.propertyKeyTagListTitle' }
	},
	form: {
		containerUuid: '3630b32c31c7492681c5c79e76af90a9',
		title: { key: 'model.administration.propertyKeys.propertyKeyTagDetailTitle' }
	},
	containerBehavior: ctx => ctx.injector.get(ModelAdministrationPropertyKeyTagBehavior),
	dataService: ctx => ctx.injector.get(ModelAdministrationPropertyKeyTagDataService),
	layoutConfiguration: {
		groups: [{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: ['PropertyKeyTagCategoryFk', 'DescriptionInfo', 'RemarkInfo', 'UserPropertyKeyTag', 'ModelImportPropertyKeyTag', 'PublicApiPropertyKeyTag']
		}],
		overloads: {
			PropertyKeyTagCategoryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ModelAdministrationPropertyKeyTagCategoryLookupDataService
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('model.administration.', {
				PropertyKeyTagCategoryFk: {key: 'propertyKeyTagCategory'},
				UserPropertyKeyTag: {key: 'isUserPropertyKeyTag'},
				ModelImportPropertyKeyTag: {key: 'isModelImportPropertyKeyTag'},
				PublicApiPropertyKeyTag: {key: 'isPublicApiPropertyKeyTag'}
			})
		}
	},
});
