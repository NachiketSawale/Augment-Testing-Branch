/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMapAreaDataService } from '../services/model-map-area-data.service';
import { IModelMapAreaEntity } from './entities/model-map-area-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
export const MODEL_MAP_AREA_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelMapAreaEntity>({
	grid: {
		title: { key: 'model.map.area.list'},
		containerUuid: 'a8a7ae07b8834324bcc2cee437170d2a',
	},
	form: {
		title: { key: 'model.map.area.detail'},
		containerUuid: '86480935d53747df8974e5341d9aabb2',
	},
	dataService: ctx => ctx.injector.get(ModelMapAreaDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Map', typeName: 'MapAreaDto' },
	permissionUuid: 'a278dd3b0f874c069d02e528978a59bb',
	layoutConfiguration: async ctx => {
		const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IModelMapAreaEntity>>{
			groups: [{
				gid: 'baseGroup',
				attributes: ['Description', 'LocationFk']
			}],
			overloads: {
				ModelFk: mlp.generateModelLookup(),
				LocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true),

			},
			labels: {

				...prefixAllTranslationKeys('model.map.', {
					LocationFk: { key: 'locationfk' },
				})

			}
		};
	},

});