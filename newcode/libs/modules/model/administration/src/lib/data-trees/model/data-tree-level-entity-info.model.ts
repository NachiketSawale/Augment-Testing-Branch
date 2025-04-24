/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { IDataTreeLevelEntity } from './entities/entities';
import { ModelAdministrationDataTreeLevelDataService } from '../services/data-tree-level-data.service';

export const DATA_TREE_LEVEL_ENTITY = EntityInfo.create<IDataTreeLevelEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'DataTreeLevelDto'
	},
	grid: {
		title: {key: 'model.administration.dataTree.dataTreeLevelListTitle'}
	},
	form: {
		title: {key: 'model.administration.dataTree.dataTreeLevelDetailTitle'},
		containerUuid: 'ff23c6d3aea74dbcbeb0e3122b368be1'
	},
	permissionUuid: 'f97ebbe0f8594fe686c78899cbb3c59b',
	dataService: ctx => ctx.injector.get(ModelAdministrationDataTreeLevelDataService),
	layoutConfiguration: async ctx => {
		const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IDataTreeLevelEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['Sorting', 'DescriptionPattern', 'CodePattern', 'PropertyKeyFk']
			}],
			overloads: {
				PropertyKeyFk: pkLookupProvider.generatePropertyKeyLookup()
			},
			labels: prefixAllTranslationKeys('model.administration.', {
				DescriptionPattern: 'descriptionPattern',
				CodePattern: 'codePattern',
				PropertyKeyFk: 'propertyKey'
			})
		};
	}
});
