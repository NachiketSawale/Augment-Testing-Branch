/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo, IEntityTreeConfiguration} from '@libs/ui/business-base';
import {IQtoSheetEntity} from '../model/entities/qto-sheet-entity.interface';
import {QtoMainSheetBehavior} from './qto-main-sheet-behavior.service';
import {QtoMainSheetDataService} from './qto-main-sheet-data.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {BasicsSharedCustomizeLookupOverloadProvider} from '@libs/basics/shared';
import {QtoModule} from '@libs/qto/interfaces';

export const QTO_MAIN_SHEET_ENTITY_INFO = EntityInfo.create<IQtoSheetEntity> ({
    grid: {
        title: { key: 'qto.main.structure', text: 'Sheet' },
        behavior: ctx => ctx.injector.get(QtoMainSheetBehavior),
        treeConfiguration: ctx => {
            return {
                parent: function (entity: IQtoSheetEntity) {
                    const serive = ctx.injector.get(QtoMainSheetDataService);
                    return serive.parentOf(entity);
                },
                children: function (entity: IQtoSheetEntity) {
                    const service = ctx.injector.get(QtoMainSheetDataService);
                    return service.childrenOf(entity);
                }
            } as IEntityTreeConfiguration<IQtoSheetEntity>;
        }
    },
    dataService: ctx => ctx.injector.get(QtoMainSheetDataService),
    dtoSchemeId: { moduleSubModule: QtoModule.Main, typeName: 'QtoSheetDto' },
    permissionUuid: '4bf041831fee4206bc5c096770c0a56e',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['Description', 'IsReadonly', 'Remark', 'Date', 'QtoSheetStatusFk']
        }],
        overloads: {
           //TODO: missing => regex for Description
            Remark: { maxLength: 252 },
            QtoSheetStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideQtoSheetStatusReadonlyLookupOverload()
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                Remark: {text: 'Remark', key: 'entityRemark'},
                Date: {text: 'Date', key: 'entityDate'}
            }),
            ...prefixAllTranslationKeys('qto.main.', {
                Description: {text: 'Sheet No.', key: 'qtoDetailPageNumber'},
                From: {text: 'From', key: 'from'},
                To: {text: 'to', key: 'To'},
                IsReadonly: {text: 'Read-Only', key: 'IsReadonly'},
                QtoSheetStatusFk: {text: 'Qto Sheet Status', key: 'qtoSheetStatus'}
            })
        }
    }
});