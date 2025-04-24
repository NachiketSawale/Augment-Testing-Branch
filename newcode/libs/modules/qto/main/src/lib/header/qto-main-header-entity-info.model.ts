/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainHeaderGridBehavior} from './qto-main-header-grid-behavior.service';
import {QtoMainHeaderGridDataService} from './qto-main-header-grid-data.service';
import {QtoMainHeaderValidationService} from './qto-main-header-validation.service';
import {QtoMainHeaderLayoutService} from './qto-main-header-layout.service';
import {QtoModule} from '@libs/qto/interfaces';

export const QTO_MAIN_HEADER_ENTITY_INFO = EntityInfo.create<IQtoMainHeaderGridEntity>({
    grid: {
        title: { key: 'qto.main.header.gridTitle', text: 'Quantity Takeoff Header'},
        behavior: ctx => ctx.injector.get(QtoMainHeaderGridBehavior)
    },
    form: {
        containerUuid: '7cbac2c0e6f6435aa602a72dccd50882',
        title: {key: 'qto.main.header.formTitle', text: 'Quantity Takeoff Header Details'},
    },
    dataService: ctx => ctx.injector.get(QtoMainHeaderGridDataService),
    validationService: ctx => ctx.injector.get(QtoMainHeaderValidationService),
    dtoSchemeId: {moduleSubModule: QtoModule.Main, typeName: 'QtoHeaderDto'},
    permissionUuid: '7cbac2c0e6f6435aa602a72dccd50881',
    layoutConfiguration: context => {
        return context.injector.get(QtoMainHeaderLayoutService).generateLayout();
    }
});