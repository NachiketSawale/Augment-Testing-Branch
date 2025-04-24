/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {QtoMainSubtotalDataService} from './qto-main-subtotal-data.service';
import {QtoMainSubtotalBehaviorService} from './qto-main-subtotal-behavior.service';
import {BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {ProjectSharedLookupOverloadProvider} from '@libs/project/shared';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {QtoModule} from '@libs/qto/interfaces';

export const QTO_MAIN_SUBTOTAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoMainDetailGridEntity>({
    grid: {
        title: { key: 'qto.main.subtotal.title', text: 'Subtotal' },
        behavior: ctx => ctx.injector.get(QtoMainSubtotalBehaviorService),
    },
    form: {
        containerUuid: '31593395b9764e3aaae9c678f599d1c3',
        title: { text: 'qto.main.subtotal.form', key: 'qto.main.subtotal.form' },
        //TODD : Wait support behavior(remove toolbar create/delete) -- Jun
    },
    dataService: ctx => ctx.injector.get(QtoMainSubtotalDataService),
    dtoSchemeId: { moduleSubModule: QtoModule.Main, typeName: 'QtoDetailDto' },
    permissionUuid: 'BE8B60195CF44F5680C37B96BCED9BA6',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['BoqItemFk', 'BasUomFk', 'PrjLocationFk', 'SubTotal', 'RemarkText'],

        }],
        overloads: {
            //BoqItemFk  TODD : Wait BoqItemFk lookup support -- Jun
            BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
            PrjLocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true),
            BoqItemCode: {readonly: true},
            SubTotal: {readonly: true},
            RemarkText: {readonly: true}
        },
        labels: {
            ...prefixAllTranslationKeys('qto.main.', {
                BoqItemFk: {text: 'Boq Item', key: 'boqItem'},
                PrjLocationFk: {text: 'Location', key: 'prjLocationFk'},
                SubTotal: {text: 'SubTotal', key: 'SubTotal'},
                RemarkText: {text: 'Remark', key: 'RemarkText'},
                BasUomFk: {text: 'UoM', key: 'basUomFk'},
            }),

        }
    },
});