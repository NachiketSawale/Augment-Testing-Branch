import {EntityInfo} from '@libs/ui/business-base';
import {IQtoDetailCommentsEntity} from '../model/entities/qto-detail-comments-entity.interface';
import {qtoMainDetailCommentsBehavior} from './qto-main-detail-comments-behavior.service';
import {QtoMainDetailCommentsDataService} from './qto-main-detail-comments-data.service';
import {qtoMainDetailCommentsValidationService} from './qto-main-detail-comments-validation.service';
import {createLookup, FieldType} from '@libs/ui/common';
import {QtoCommentsTypeLookupService} from './qto-comments-type-lookup.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';

export const QTO_MAIN_DETAIL_COMMENTS_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoDetailCommentsEntity> ({
    grid: {
        title: { key: 'qto.main.comments.containerGridTitle', text: 'QTO Comments' },
        behavior: ctx => ctx.injector.get(qtoMainDetailCommentsBehavior)
    },
    dataService: ctx => ctx.injector.get(QtoMainDetailCommentsDataService),
    validationService: ctx => ctx.injector.get(qtoMainDetailCommentsValidationService),
    dtoSchemeId: { moduleSubModule: 'Qto.Main', typeName: 'QtoDetailCommentsDto' },
    permissionUuid: '004ebbd55c9947879a938a640c4a4747',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['CommentDescription','BasQtoCommentsTypeFk']
        }],
        'labels': {
            ...prefixAllTranslationKeys('qto.main.', {
                'BasQtoCommentsTypeFk': {
                    'key': 'basqtoCommentstypefk',
                    'text': 'Type',
                }
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                'CommentDescription': {
                    'key': 'entityDescription',
                    'text': 'Description',
                }
            })
        },
        overloads: {
            BasQtoCommentsTypeFk: {
                type: FieldType.Lookup,
                lookupOptions:createLookup({
                    dataServiceToken: QtoCommentsTypeLookupService
                })
            }
        }
    }
});