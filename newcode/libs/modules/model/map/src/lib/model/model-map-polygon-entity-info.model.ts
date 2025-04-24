/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMapPolygonDataService } from '../services/model-map-polygon-data.service';
import { IModelMapPolygonEntity } from './entities/model-map-polygon-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

export const MODEL_MAP_POLYGON_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelMapPolygonEntity>({
	grid: {
		title: { key: 'model.map.polygon.list' },
		containerUuid: '87476328055e41ceb232ab1f82a54e8f',
	},
	form: {
		title: { key: 'model.map.polygon.detail' },
		containerUuid: '12fe6a7a85af40ed8ce3125a3bef7442',
	},
	dataService: ctx => ctx.injector.get(ModelMapPolygonDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Map', typeName: 'MapPolygonDto' },
	permissionUuid: 'ea2e40038d9743479523fd3d3155495d',
	layoutConfiguration: async ctx => {
		const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IModelMapPolygonEntity>>{
			groups: [{
				gid: 'baseGroup',
				attributes: ['Description', 'LocationFk']
			}],
			overloads: {
				ModelFk: mlp.generateModelLookup(),
				LocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true)

			},
			labels: {
				...prefixAllTranslationKeys('model.map.', {
					LocationFk: { key: 'locationfk' },
				})

			}
		};
	},

});