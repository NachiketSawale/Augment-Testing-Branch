/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IQtoCommentEntity } from '../entities/qto-comment-entity.interface';
import { QtoFormulaCommentDataService } from '../../services/qto-formula-comment-data.service';
import { QtoFormulaCommentValidationService } from '../../services/validations/qto-formula-comment-validation.service';


export const QTO_FORMULA_COMMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoCommentEntity> ({
    grid: {
        title: {key: 'qto.formula.comment.title'}
    },
    form: {
        title: {key: 'qto.formula.comment.formTitle'},
        containerUuid: '0fcfcdb869b94462a5b12530a8d127ba'
    },
    dataService: ctx => ctx.injector.get(QtoFormulaCommentDataService),
    validationService: ctx => ctx.injector.get(QtoFormulaCommentValidationService),
    dtoSchemeId: {moduleSubModule: 'Qto.Formula', typeName: 'QtoCommentDto'},
    permissionUuid: 'c13985fe81814514b659e609551eb406',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['Code', 'CommentText']
        }],
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {key: 'entityCode'},
                CommentText: {key: 'entityCommentText'}
            })
        }
    }
});