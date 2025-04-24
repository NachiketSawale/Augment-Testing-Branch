/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
    BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import {QtoFormulaUomDataService} from '../qto-formula-uom-data.service';
import {IQtoFormulaUomEntity} from '../../model/entities/qto-formula-uom-entity.interface';
import {QtoFormulaGridDataService} from '../qto-formula-grid-data.service';
import { QtoShareFormulaType } from '@libs/qto/shared';

@Injectable({
    providedIn: 'root'
})

export class QtoFormulaUomValidationService extends BaseValidationService<IQtoFormulaUomEntity> {

    private parentService = inject(QtoFormulaGridDataService);
    
    public constructor(private dataService: QtoFormulaUomDataService) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<IQtoFormulaUomEntity> {
        return {
            UomFk: this.validateIsUnique,
            Value1IsActive: this.validateCommonValueIsActive,
            Value2IsActive: this.validateCommonValueIsActive,
            Value3IsActive: this.validateCommonValueIsActive,
            Value4IsActive: this.validateCommonValueIsActive,
            Value5IsActive: this.validateCommonValueIsActive,
            Operator1: this.validateCommonOperator,
            Operator2: this.validateCommonOperator,
            Operator3: this.validateCommonOperator,
            Operator4: this.validateCommonOperator,
            Operator5: this.validateCommonOperator
        };
    }

    /**
     *The common function to validate Value IsActive.
     */
    private validateCommonValueIsActive(info: ValidationInfo<IQtoFormulaUomEntity>): ValidationResult {
        const entity = info.entity;
        const model = info.field;
        const value = info.value as boolean;

        let readOnlyField: string = '';
        switch (model){
            case 'Value1IsActive':
                readOnlyField = 'Operator1';
                break;
            case 'Value2IsActive':
                readOnlyField = 'Operator2';
                break;
            case 'Value3IsActive':
                readOnlyField = 'Operator3';
                break;
            case 'Value4IsActive':
                readOnlyField = 'Operator4';
                break;
            case 'Value5IsActive':
                readOnlyField = 'Operator5';
                break;
        }

        // set the Operators readonly
        const parent = this.parentService.getSelectedEntity();
        if (parent && !(parent.QtoFormulaTypeFk === QtoShareFormulaType.Script || parent.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput)) {
            this.dataService.setEntityReadOnlyFields(entity, [{field: readOnlyField, readOnly: value}]);
        }

        // cell change
        _.set(entity, model, value);
        this.valueIsActiveChange(entity);

        // if active the value, will do validation for operator.
        if (value){
            this.validateOperatorOnchangeValueIsActive(entity, readOnlyField);
        }

        return new ValidationResult();
    }

    private validateOperatorOnchangeValueIsActive(entity: IQtoFormulaUomEntity, field: string) {
        const operatorInfo: ValidationInfo<IQtoFormulaUomEntity> = {
            entity: entity,
            field: field,
            value: _.get(entity, field)
        };
        const result = this.validateCommonOperator(operatorInfo);
        result.apply = true;
        this.getEntityRuntimeData().addInvalid(entity, {result: result, field: field});
    }

    private valueIsActiveChange(entity: IQtoFormulaUomEntity){
        const parent = this.parentService.getSelectedEntity();
        if (parent && parent.QtoFormulaTypeFk === QtoShareFormulaType.Predefine){
            entity.Operator1 = entity.Value1IsActive ? entity.Operator1 : '';
            entity.Operator2 = entity.Value2IsActive ? entity.Operator2 : '';
            entity.Operator3 = entity.Value3IsActive ? entity.Operator3 : '';
            entity.Operator4 = entity.Value4IsActive ? entity.Operator4 : '';
            entity.Operator5 = entity.Value5IsActive ? entity.Operator5 : '';
        }
    }

    /**
     *The common function to validate Operator.
     */
    private validateCommonOperator(info: ValidationInfo<IQtoFormulaUomEntity>): ValidationResult {
        const entity = info.entity;
        const model = info.field;

        let valueIsActive: boolean = false;
        switch (model){
            case 'Operator1':
                valueIsActive = entity.Value1IsActive;
                break;
            case 'Operator2':
                valueIsActive = entity.Value2IsActive;
                break;
            case 'Operator3':
                valueIsActive = entity.Value3IsActive;
                break;
            case 'Operator4':
                valueIsActive = entity.Value4IsActive;
                break;
            case 'Operator5':
                valueIsActive = entity.Value5IsActive;
                break;
        }

        const parent = this.parentService.getSelectedEntity();
        if (parent && parent.QtoFormulaTypeFk !== QtoShareFormulaType.Script && valueIsActive){
            return this.validateIsMandatory(info);
        }

        return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoFormulaUomEntity> {
        return this.dataService;
    }
}