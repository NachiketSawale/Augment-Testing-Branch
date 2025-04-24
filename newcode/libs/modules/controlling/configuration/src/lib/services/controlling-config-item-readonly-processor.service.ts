/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrFormulaPropDefEntity } from '../model/entities/mdc-contr-formula-prop-def-entity.interface';
import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {
    ControllingConfigurationFormulaDefinitionDataService
} from './controlling-configuration-formula-definition-data.service';
import {inject} from '@angular/core';
import {ContrConfigFormulaTypeHelper} from './controlling-config-formula-type-helper.service';

export class ControllingConfigItemReadonlyProcessor<T extends IMdcContrFormulaPropDefEntity> extends EntityReadonlyProcessorBase<T>{

    private contrConfigFormulaTypeHelper = inject(ContrConfigFormulaTypeHelper);

    public constructor(protected dataService: ControllingConfigurationFormulaDefinitionDataService<T>) {
        super(dataService);
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {
            Code: d => !d.item || d.item.IsBaseConfigData,
            BasContrColumnTypeFk: d =>!d.item || d.item.IsBaseConfigData,
            DescriptionInfo: d => !d.item || d.item.IsBaseConfigData,
            Formula: d => !d.item || d.item.IsBaseConfigData,

            IsDefault: d => !d.item || !d.item.BasContrColumnTypeFk || !this.contrConfigFormulaTypeHelper.isDefaultEditable(d.item.BasContrColumnTypeFk),
            IsEditable: d => !d.item || !d.item.BasContrColumnTypeFk || this.contrConfigFormulaTypeHelper.isCac_m(d.item.BasContrColumnTypeFk),
            IsVisible: d => !d.item || !d.item.BasContrColumnTypeFk || (!this.contrConfigFormulaTypeHelper.isCustFactor(d.item.BasContrColumnTypeFk) && !(!d.item.IsBaseConfigData && this.contrConfigFormulaTypeHelper.isSac(d.item.BasContrColumnTypeFk)))
        };
    }

    public override process(toProcess: T) {
        super.process(toProcess);

        if(!toProcess) {
            return;
        }

        toProcess.ignoreFormulaInput = toProcess.IsBaseConfigData || !toProcess.BasContrColumnTypeFk || this.contrConfigFormulaTypeHelper.isFactorType(toProcess.BasContrColumnTypeFk);
    }
}
