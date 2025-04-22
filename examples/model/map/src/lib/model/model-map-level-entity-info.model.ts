/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMapLevelDataService } from '../services/model-map-level-data.service';
import { IModelMapLevelEntity } from './entities/model-map-level-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

export const MODEL_MAP_LEVEL_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelMapLevelEntity>({
	grid: {
		title: { key: 'model.map.level.list'},
		containerUuid: '0286f5d963784449a6b145acb4676fe6',
	},
	form: {
		title: { key: 'model.map.level.detail'},
		containerUuid: '795b9b8a7d824f90a0e86802378e3924',
	},
	dataService: ctx => ctx.injector.get(ModelMapLevelDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Map', typeName: 'MapLevelDto' },
	permissionUuid: '8fe0a05f213e493190af7d61669e1621',
	layoutConfiguration: async ctx => {
		const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IModelMapLevelEntity>>{
			groups: [{
				gid: 'baseGroup',
				attributes: [
					'PrjDocumentFk',
					'LocationFk',
					'Description',
					'ZMax',
					'ZMin',
					'OrientationAngle',
					'TranslationX',
					'TranslationY',
					'Scale',
					'ZLevel',
					'ViewingDistance',
					'IsUp'
				]
			}],
			overloads: {
				ModelFk: mlp.generateModelLookup(),
				LocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true)

			},
			labels: {
				...prefixAllTranslationKeys('model.map.', {
					LocationFk: { key: 'locationfk' },
					ZMax: { key: 'zmax' },
					ZMin: { key: 'zmin' },
					OrientationAngle: { key: 'orientationangle' },
					TranslationX: { key: 'translationx' },
					TranslationY: { key: 'translationy' },
					Scale: { key: 'scale' },
					ZLevel: { key: 'zlevel' },
					ViewingDistance: { key: 'viewingdistance' },
					IsUp: { key: 'isup' },

				}),

			}
		};
	},
});