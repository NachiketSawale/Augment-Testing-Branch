/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
    BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
} from '@libs/platform/data-access';
import {IQtoCommentEntity} from '../../model/entities/qto-comment-entity.interface';
import {QtoFormulaCommentDataService} from '../qto-formula-comment-data.service';

@Injectable({
    providedIn: 'root'
})

export class QtoFormulaCommentValidationService extends BaseValidationService<IQtoCommentEntity> {

    public constructor(private qtoFormulaCommentDataService: QtoFormulaCommentDataService) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<IQtoCommentEntity> {
        return {
            Code: this.validateIsUnique
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoCommentEntity> {
        return this.qtoFormulaCommentDataService;
    }
}