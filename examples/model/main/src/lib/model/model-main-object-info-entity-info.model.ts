/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObjectInfoDataService } from '../services/model-main-object-info-data.service';
import { IModelObjectInfo } from './models';
import { ILayoutConfiguration } from '@libs/ui/common';

export const MODEL_MAIN_OBJECT_INFO_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelObjectInfo>({
    grid: {
        title: { key: 'objectInfoList' },
    },
    form: {
        title: { key: 'model.main.objectInfoDetails' },
        containerUuid: '114f1a46eaee483d829648e7dd60a63c',
    },
    dataService: ctx => ctx.injector.get(ModelMainObjectInfoDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectAttributeDto' },
    permissionUuid: '36abc91df46f4129a78cc26fe79a6fdc',
    layoutConfiguration: async ctx => {
        return <ILayoutConfiguration<IModelObjectInfo>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['name', 'formattedvalue', 'origin', 'kind']
                }
            ],
            overloads: {
                name: {
                    formatter: 'text',
                    readonly: true,
                    grid: {
                        field: 'Name'
                    }
                },
                formattedvalue: {
                    formatter: 'text',
                    readonly: true,
                    grid: {
                        field: 'FormattedValue'
                    }
                },
                origin: {
                    formatter: 'text',
                    readonly: true,
                    grid: {
                        field: 'Origin'
                    }
                },
                kind: {
                    formatter: 'text',
                    readonly: true,
                    grid: {
                        field: 'Kind'
                    }
                }
            }
        };
    }

});