/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { CloudTranslationLanguageDataService } from '../services/cloud-translation-language-data.service';
import { ILanguageEntity } from './entities/language-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CLOUD_TRANSLATION_LANGUAGE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILanguageEntity>({
    grid: {
        title: { key: 'cloud.translation.languageListTitle' },
    },
    form: {
        title: { key: 'cloud.translation.languageDetailTitle' },
        containerUuid: '6b045c1965cb43beab6f0efff980ca3c',
    },
    dataService: ctx => ctx.injector.get(CloudTranslationLanguageDataService),
    dtoSchemeId: { moduleSubModule: 'Cloud.Translation', typeName: 'LanguageDto' },
    permissionUuid: 'f13984620ae3483c913aef196f02ad7e',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    text: 'Basic Data',
                    key: 'cloud.common.entityProperties',
                },
                attributes: [
                    'Id',
                    'Description',
                    'Sorting',
                    'IsDefault',
                    'Culture',
                    'LanguageId',
                    'IsSystem',
                    'ExportColumnName',
                    'IsLive',
                ],
            },
        ],

        labels: {
            ...prefixAllTranslationKeys('cloud.translation.', {
                Culture: {
                    key: 'culture',
                    text: 'Culture',
                },
                LanguageId: {
                    key: 'languageid',
                    text: 'Language Id',
                },
                IsSystem: {
                    key: 'issystem',
                    text: 'Is System',
                },
                ExportColumnName: {
                    key: 'exportcolumnname',
                    text: 'Export Column Name',
                },

            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                Id: {
                    key: 'entityId',
                    text: 'Id',
                },
                Description: {
                    key: 'entityDescription',
                    text: 'Description',
                },
                Sorting: {
                    key: 'entitySorting',
                    text: 'Sorting',
                },
                IsDefault: {
                    key: 'entityIsDefault',
                    text: 'Is Default',
                },
                IsLive: {
                    key: 'entityIsLive',
                    text: 'Active',
                },

            }),
        },
        overloads: {
            Id: { readonly: true },
            IsSystem: { readonly: true },
            IsDefault: { readonly: true },
            Culture: { readonly: true },
            LanguageId: { readonly: true },
            ExportColumnName: { readonly: true },
            Description: { readonly: true },
        },
    },

});