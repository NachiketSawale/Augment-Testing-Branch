/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObjectDataService } from '../services/model-main-object-data.service';
import { IModelObjectEntity } from '../model/entities/model-object-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
// import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


export const MODEL_MAIN_OBJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelObjectEntity>({
    grid: {
        title: { key: 'model.main.modelObjectListTitle' },
        // behavior: ctx => ctx.injector.get(ModelMainObjectBehavior),
    },
    form: {
        title: { key: 'model.main.modelObjectDetailTitle' },
        containerUuid: 'DF88148725F34267A7E7D9F015331216',
    },
    dataService: ctx => ctx.injector.get(ModelMainObjectDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ModelObjectDto' },
    permissionUuid: '765FE63C3E3446C8945AEA76AB584249',
    layoutConfiguration: async ctx => {
        //  const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
        return <ILayoutConfiguration<IModelObjectEntity>>{
            suppressHistoryGroup: true,
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['ObjectFk', 'ModelFk', 'Description', 'MeshId', 'CpiId', 'CadIdInt', 'IsNegative', 'IsComposite', 'IsDeleted']
                },
                {
                    gid: 'referenceGroup',
                    attributes: ['ControllingUnitFk']
                },
                {
                    gid: 'History',
                    attributes: ['InsertedAt', 'UpdatedAt'],
                }
            ],
            overloads: {
                CpiId: {
                    readonly: true
                },
                MeshId: {
                    readonly: true
                },
                IsNegative: {
                    readonly: true
                },
                IsComposite: {
                    readonly: true
                },
                IsDeleted: {
                    readonly: true
                },

                // ModelFk: mlp.generateModelLookup(),/// this lookup does not work well,

                // ControllingUnitFk: { TODO:lookup is not ready
                //     type: FieldType.Lookup,
                //     lookupOptions: createLookup({
                //         dataServiceToken: BasicsShareControllingUnitLookupService
                //     })
                // },

                // ObjectFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ TODO:lookup is not ready
                // 	dataServiceName: 'modelMainObjectLookupDataService',
                // 	enableCache: true,
                // 	filter: function (item) {
                // 		return item.ModelFk;
                // 	},
                // 	readonly: true
                // }),
            },
            fid: 'model.main.modelobject.detailForm',
            labels: {
                ...prefixAllTranslationKeys('model.main.', {
                    parentObject: { key: 'parentObject' },
                    CadIdInt: { key: 'objectCadIdInt' },
                    CpiId: { key: 'objectCpiId' },
                    MeshId: { key: 'objectMeshId' },
                    IsComposite: { key: 'objectIsComposite' },
                    IsNegative: { key: 'objectIsNegative' },
                    IsDeleted: { key: 'entityIsDeleted' },
                    ModelFk: { key: 'model' },
                    ControllingUnitFk: { key: 'entityControllingUnit' },
                    ObjectFk: { key: 'parentObject' }
                })
            }
        };
    }

});