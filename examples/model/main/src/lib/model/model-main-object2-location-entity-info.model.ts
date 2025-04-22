/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObject2LocationDataService } from '../services/model-main-object2-location-data.service';
import { IModelObject2LocationEntity } from './models';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
export const MODEL_MAIN_OBJECT2_LOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelObject2LocationEntity>({
    grid: {
        title: { key: 'modelObject2LocationListTitle' },
    },
    form: {
        title: { key: 'model.main.modelObject2LocationDetailTitle' },
        containerUuid: 'fe0d49279eb4464a8e6744816de8ff76',
    },
    dataService: ctx => ctx.injector.get(ModelMainObject2LocationDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ModelObject2LocationDto' },
    permissionUuid: '119fdb6a6c384668b9cc6c9882c14161',
    layoutConfiguration: async ctx => {
        return <ILayoutConfiguration<IModelObject2LocationEntity>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['LocationFK']
                }
            ],
            overloads: {
                LocationFK: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true)
            },
            labels: {
                ...prefixAllTranslationKeys('model.main.', {
                    LocationFk: { key: 'entityLocation', text: 'Location' },
                }),
            },
        };
    }

});