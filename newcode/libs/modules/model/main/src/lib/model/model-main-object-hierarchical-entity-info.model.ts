/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObjectHierarchicalDataService } from '../services/model-main-object-hierarchical-data.service';
import { IModelObjectEntity } from './models';
import { ILayoutConfiguration } from '@libs/ui/common';


export const MODEL_MAIN_OBJECT_HIERARCHICAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelObjectEntity>({
    grid: {
        title: { key: 'modelObjectHierarchicalListTitle' },
    },

    dataService: ctx => ctx.injector.get(ModelMainObjectHierarchicalDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ModelObjectDto' },
    permissionUuid: 'b4a5c54943ca4209ab746fddedd4a00e',
    layoutConfiguration: async ctx => {
        return <ILayoutConfiguration<IModelObjectEntity>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['Description', 'CpiId', 'IsComposite']
                }
            ],
            overloads: {
                CpiId: {readonly: true},
                IsComposite: {readonly: true},
                Description: {readonly: true}
            }
        };
    }

});