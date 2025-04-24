/*
 * Copyright(c) RIB Software GmbH
 */

import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { ModelAdministrationPropertyKeyTagCategoryDataService } from '../services/property-key-tag-category-data.service';
import { IPropertyKeyTagCategoryEntity } from './entities/property-key-tag-category-entity.interface';

export const PROPERTY_KEY_TAG_CATEGORY_ENTITY_INFO = EntityInfo.create<IPropertyKeyTagCategoryEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'PropertyKeyTagCategoryDto'
	},
	permissionUuid: 'e7bee8d36e8f475b9812eb0d21696c49',
	grid: {
		title: { key: 'model.administration.propertyKeys.propertyKeyTagCategoryList' },
		treeConfiguration: true
	},
	form: {
		containerUuid: 'f0b70206735642cab5472cc4f5620c65',
		title: { key: 'model.administration.propertyKeys.propertyKeyTagCategoryDetail' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationPropertyKeyTagCategoryDataService),
	layoutConfiguration: {
		groups: [{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: ['DescriptionInfo', 'RemarkInfo']
		}]
	}
});
