/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { IPropertyKeyEntity } from './entities/property-key-entity.interface';
import { ModelAdministrationPropertyKeyDataService } from '../services/property-key-data.service';
import { ModelAdministrationPropertyKeyTagHelperService } from '../services/property-key-tag-helper.service';
import { ModelAdministrationPropertyKeyBehaviorService } from '../behaviors/property-key-behavior.service';

export const PROPERTY_KEY_ENTITY_INFO = EntityInfo.create<IPropertyKeyEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'PropertyKeyDto'
	},
	permissionUuid: 'f3dd6a81c5e14fddbe2f1b0b8cf05340',
	grid: {
		title: { key: 'model.administration.propertyKeys.propertyKeyListTitle' }
	},
	form: {
		containerUuid: '9889fc35cb8640ba9b59f0c8c663698f',
		title: { key: 'model.administration.propertyKeys.propertyKeyDetailTitle' }
	},
	containerBehavior: ctx => ctx.injector.get(ModelAdministrationPropertyKeyBehaviorService),
	dataService: ctx => ctx.injector.get(ModelAdministrationPropertyKeyDataService),
	layoutConfiguration: ctx => {
		const tagHelperSvc = ctx.injector.get(ModelAdministrationPropertyKeyTagHelperService);

		return <ILayoutConfiguration<IPropertyKeyEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['PropertyName', 'ValueTypeFk', 'TagIds']
			}, {
				gid: 'defaultsGroup',
				attributes: ['UseDefaultValue', /* TODO: default value */ 'BasUomDefaultFk']
			}],
			overloads: {
				PropertyName: {
					readonly: true
				},
				ValueTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelValueTypeReadonlyLookupOverload(),
				BasUomDefaultFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				TagIds: tagHelperSvc.generateTagsFieldOverload()
			},
			labels: {
				PropertyName: {key: 'cloud.common.entityName'},
				...prefixAllTranslationKeys('model.administration.', {
					ValueTypeFk: {key: 'propertyValueType'},
					TagIds: {key: 'propertyKeys.tags'},
					defaultsGroup: {key: 'defaultsGroup'},
					UseDefaultValue: {key: 'useDefaultValue'},
					BasUomDefaultFk: {key: 'defaultUoM'}
				})
			}
		};
	}
});
