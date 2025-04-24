/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObject2ObjectSetDataService } from '../services/model-main-object2-object-set-data.service';
import { IObjectSet2ObjectEntity } from './models';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';


export const MODEL_MAIN_OBJECT2_OBJECT_SET_ENTITY_INFO: EntityInfo = EntityInfo.create<IObjectSet2ObjectEntity>({
    grid: {
        title: { key: 'model.main.object2ObjectSetListTitle' },
        //   behavior: ctx => ctx.injector.get(ModelMainObject2ObjectSetBehavior),
    },
    form: {
        title: { key: 'model.main.object2ObjectSetDetailTitle' },
        containerUuid: 'f300d21290d6492a963ed4ab07145ff0',
    },
    dataService: ctx => ctx.injector.get(ModelMainObject2ObjectSetDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectSet2ObjectDto' },
    permissionUuid: 'de6317b8a309450485e28addd88f3577',
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
                    attributes: ['ProjectFk', 'ObjectSetFk', 'ModelFk']
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
                // objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ TODO: lookup is not ready
                // 	dataServiceName: 'modelMainObjectSetLookupDataService',
                // 	enableCache: true,
                // 	filter: function () {
                // 		return getProjectId();
                // 	},
                // 	readonly: true
                // }),

            },
            labels: {
                ...prefixAllTranslationKeys('model.main.', {
                    ModelFk: { key: 'model' },
                    ObjectFk: { key: 'entityObject' },
                })
            }
        };
    }
});