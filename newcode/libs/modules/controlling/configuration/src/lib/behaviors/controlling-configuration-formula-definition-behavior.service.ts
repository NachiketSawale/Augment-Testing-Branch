/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMdcContrFormulaPropDefEntity } from '../model/entities/mdc-contr-formula-prop-def-entity.interface';
import {
    ControllingConfigurationFormulaDefinitionDataService
} from '../services/controlling-configuration-formula-definition-data.service';
import {
    ControllingConfigurationFormulaDefinitionValidateService
} from '../services/controlling-configuration-formula-definition-validate.service';

@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationFormulaDefinitionBehavior implements IEntityContainerBehavior<IGridContainerLink<IMdcContrFormulaPropDefEntity>, IMdcContrFormulaPropDefEntity> {

    private readonly dataService = inject(ControllingConfigurationFormulaDefinitionDataService);
    private readonly  validateService = inject(ControllingConfigurationFormulaDefinitionValidateService);
    public onCreate(containerLink: IGridContainerLink<IMdcContrFormulaPropDefEntity>) {
        this.dataService.refreshAllLoaded().then((data)=> this.dataService.dataHandle(data));
        this.validateService.loadColumnDef();
    }
}