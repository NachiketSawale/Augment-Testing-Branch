import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IQtoFormulaEntity} from '../../model/entities/qto-formula-entity.interface';
import {QtoFormulaGridDataService} from '../qto-formula-grid-data.service';
import { QtoShareFormulaType } from '@libs/qto/shared';



@Injectable({
    providedIn: 'root'
})

export class QtoFormulaGridValidationService extends BaseValidationService<IQtoFormulaEntity> {

    private dataService = inject(QtoFormulaGridDataService);

    protected override generateValidationFunctions(): IValidationFunctions<IQtoFormulaEntity> {
        return {
            Code: this.validateIsUnique,
            Value1IsActive: this.validateValueIsActive,
            Value2IsActive: this.validateValueIsActive,
            Value3IsActive: this.validateValueIsActive,
            Value4IsActive: this.validateValueIsActive,
            Value5IsActive: this.validateValueIsActive,
            Operator1: this.applyValidationField,
            Operator2: this.applyValidationField,
            Operator3: this.applyValidationField,
            Operator4: this.applyValidationField,
            Operator5: this.applyValidationField,
            QtoFormulaTypeFk: this.validateQtoFormulaTypeFk,
            IsDefault: this.validateIsDefault,
            IsMultiline: this.validateIsMultiline
        };
    }

    public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoFormulaEntity> {
        return this.dataService;
    }
    protected applyValidationField(info: ValidationInfo<IQtoFormulaEntity>): ValidationResult {
        let valueFiled = false;
        switch (info.field) {
            case 'Operator1':
                valueFiled = info.entity.Value1IsActive;
                break;
            case 'Operator2':
                valueFiled = info.entity.Value2IsActive;
                break;
            case 'Operator3':
                valueFiled = info.entity.Value3IsActive;
                break;
            case 'Operator4':
                valueFiled = info.entity.Value4IsActive;
                break;
            case 'Operator5':
                valueFiled = info.entity.Value5IsActive;
                break;
            default:
                break;
        }
        if (valueFiled && info.entity && info.entity.QtoFormulaTypeFk !== QtoShareFormulaType.Script) {
            return this.validateIsMandatory(info);
        }
        return new ValidationResult();
    }

    protected validateValueIsActive(info: ValidationInfo<IQtoFormulaEntity>): ValidationResult {

        if (info.entity.QtoFormulaTypeFk === QtoShareFormulaType.Predefine || info.entity.QtoFormulaTypeFk === QtoShareFormulaType.Script) {
            info.entity.Operator1 = info.entity.Value1IsActive ? info.entity.Operator1 : null;
            info.entity.Operator2 = info.entity.Value2IsActive ? info.entity.Operator2 : null;
            info.entity.Operator3 = info.entity.Value3IsActive ? info.entity.Operator3 : null;
            info.entity.Operator4 = info.entity.Value4IsActive ? info.entity.Operator4 : null;
            info.entity.Operator5 = info.entity.Value5IsActive ? info.entity.Operator5 : null;
        }

        if (!(info.entity.QtoFormulaTypeFk === QtoShareFormulaType.Script || info.entity.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput)) {
            return this.applyValidationField(info);
        }
        return new ValidationResult();
    }

    protected validateQtoFormulaTypeFk(info: ValidationInfo<IQtoFormulaEntity>): ValidationResult {
        const curItem = info.entity;
        if (curItem.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput) {
            curItem.Operator1 = null;
            curItem.Operator2 = null;
            curItem.Operator3 = null;
            curItem.Operator4 = null;
            curItem.Operator5 = null;
        }
        // todo: depend on 'changeSciptEditStatus' PlatformMessenger;
        return new ValidationResult();
    }

    protected validateIsDefault(info: ValidationInfo<IQtoFormulaEntity>): ValidationResult {
        // todo depend on 'platformPropertyChangedUtil'
        // platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, field);
        return new ValidationResult();
    }

    protected validateIsMultiline(info: ValidationInfo<IQtoFormulaEntity>): ValidationResult {
        if (!info.entity.IsMultiline) {
            info.entity.MaxLinenumber = null;
        }
        return new ValidationResult();
    }
}