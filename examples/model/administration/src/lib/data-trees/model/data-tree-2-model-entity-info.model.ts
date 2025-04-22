/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { IDataTree2ModelEntity } from './entities/entities';
import { ModelAdministrationDataTree2ModelDataService } from '../services/data-tree-2-model-data.service';

export const DATA_TREE_2_MODEL_ENTITY = EntityInfo.create<IDataTree2ModelEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'DataTree2ModelDto'
	},
	grid: {
		title: {key: 'model.administration.dataTree.dataTree2ModelListTitle'}
	},
	form: {
		title: {key: 'model.administration.dataTree.dataTree2ModelDetailTitle'},
		containerUuid: '27d6e2162efc40208eb9cebda2deec00'
	},
	permissionUuid: '710cd16529f6429fa457d207481adc26',
	dataService: ctx => ctx.injector.get(ModelAdministrationDataTree2ModelDataService),
	layoutConfiguration: async ctx => {
		const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IDataTree2ModelEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['ModelFk', 'AssignLocations', 'OverwriteLocations']
			}],
			overloads: {
				ModelFk: mlp.generateModelLookup()
			},
			labels: prefixAllTranslationKeys('model.administration.', {
				ModelFk: 'translationDescModel',
				AssignLocations: 'assignLocations',
				OverwriteLocations: 'overwriteLocations'
			})
		};
	}
});
