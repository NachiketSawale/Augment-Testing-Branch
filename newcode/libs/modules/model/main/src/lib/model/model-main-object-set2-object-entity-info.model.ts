/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObjectSet2ObjectDataService } from '../services/model-main-object-set2-object-data.service';
import { IObjectSet2ObjectEntity } from './models';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
export const MODEL_MAIN_OBJECT_SET2_OBJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IObjectSet2ObjectEntity>({
    grid: {
        title: { key: 'model.main.objectSet2ObjectListTitle' },
        //   behavior: ctx => ctx.injector.get(ModelMainObjectSet2ObjectBehavior),
    },
    form: {
        title: { key: 'model.main.objectSet2ObjectDetailTitle' },
        containerUuid: '7286433056e94cf18d40390f6d723956',
    },
    dataService: ctx => ctx.injector.get(ModelMainObjectSet2ObjectDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectSet2ObjectDto' },
    permissionUuid: '5e10c50f173549aa8530f68496ec621d', // Need to fix permission as it has same permission id as object2-objectset
    layoutConfiguration: async ctx => {
        const [
			pjLookupProvider,
			mdlLookupProvider
		] = await Promise.all([
			ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN),
			ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN)
		]);
        return <ILayoutConfiguration<IObjectSet2ObjectEntity>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['ProjectFk', 'ObjectFk', 'ModelFk']
                }
            ],
            overloads: {

                ProjectFk: {
					...pjLookupProvider.generateProjectLookup(),
					readonly: true
				},
				ModelFk: {
					...mdlLookupProvider.generateModelLookup(),
					readonly: true
				},
                //   objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({  //TODO objectFK and detail lookup
                //     dataServiceName: 'modelMainObjectLookupDataService',
                //     enableCache: true,
                //     filter: function (item) {
                //         return item.ModelFk;
                //     },
                //     additionalColumns: true
                // })

            },
            labels: {
                ...prefixAllTranslationKeys('model.main.', {
                    ModelFk : { key: 'model' },
                    ObjectFk: { key: 'entityObject' },
                })
            }
        };
    }

});