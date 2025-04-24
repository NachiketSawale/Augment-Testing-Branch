/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
    BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
} from '@libs/platform/data-access';
import { IQtoFormulaScriptTransEntity } from '../../model/entities/qto-formula-script-trans-entity.interface';
import { QtoFormulaScriptValidationDataService } from '../qto-formula-script-validation-data.service';

@Injectable({
    providedIn: 'root'
})

export class QtoFormulaScriptValidationDataValidationService extends BaseValidationService<IQtoFormulaScriptTransEntity> {

    public constructor(private readonly dataService: QtoFormulaScriptValidationDataService) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<IQtoFormulaScriptTransEntity> {
        return {
            Code: this.validateIsUnique
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoFormulaScriptTransEntity> {
        return this.dataService;
    }
}