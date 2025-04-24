/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IProjectLocationEntity} from '@libs/project/interfaces';
import {IGridTreeConfiguration} from '@libs/ui/common';
import {QtoMainLocationDataService} from './qto-main-location-data.service';
import {QtoMainLoacationLayoutService} from './qto-main-loacation-layout.service';
import {QtoMainLocationBehaviorService} from './qto-main-location-behavior.service';
import {QtoMainLocationValidationService} from './qto-main-location-validation.service';

export const QTO_MAIN_LOCATION_ENTITY_INFO : EntityInfo = EntityInfo.create<IProjectLocationEntity>({
    grid: {
        title: {key:'qto.main.locations.title'},
        behavior: ctx => ctx.injector.get(QtoMainLocationBehaviorService),
        treeConfiguration: ctx => {
            return {
                parent: function (entity: IProjectLocationEntity) {
                    const service = ctx.injector.get(QtoMainLocationDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: IProjectLocationEntity) {
                    const service = ctx.injector.get(QtoMainLocationDataService);
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<IProjectLocationEntity>;
        }
    },
    dtoSchemeId: {
        moduleSubModule: 'Project.Location',
        typeName: 'LocationDto'
    },
    permissionUuid: '9FE0906F463F4AD19D9987DBB58C0704',
    dataService: ctx => ctx.injector.get(QtoMainLocationDataService),
    validationService: ctx => ctx.injector.get(QtoMainLocationValidationService),
    layoutConfiguration: (context) => {
        return context.injector.get(QtoMainLoacationLayoutService).generateConfig();
    },

});
