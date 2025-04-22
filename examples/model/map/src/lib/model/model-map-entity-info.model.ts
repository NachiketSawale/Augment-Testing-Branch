/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IModelMapEntity } from './entities/model-map-entity.interface';
import { ModelMapDataService } from '../services/model-map-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

export const MODEL_MAP_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelMapEntity>({
	grid: {
		title: { key: 'model.map.list'},
	},
	form: {
		title: { key: 'model.map.detail'},
		containerUuid: '5b2eda413a434857848e70df9ba397f9',
	},
	dataService: ctx => ctx.injector.get(ModelMapDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Map', typeName: 'MapDto' },
	permissionUuid: 'b3283ad1a7424388b03ca5a47fa09d15',
	layoutConfiguration: async ctx => {
		const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IModelMapEntity>>{
			groups: [{
				gid: 'baseGroup',
				attributes: ['Description', 'ModelFk', 'IsDefault']
			}],
			overloads: {
				ModelFk: mlp.generateModelLookup()

			},
			labels: {
				...prefixAllTranslationKeys('model.map.', {
					ModelFk: { key: 'modelfk' },
					IsDefault: { key: 'isdefault' }
				}),
			}
		};
	},
});