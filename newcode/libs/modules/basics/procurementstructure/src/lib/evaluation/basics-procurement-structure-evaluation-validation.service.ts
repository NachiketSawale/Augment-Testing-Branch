/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { IPrcStructure2EvaluationEntity } from '../model/entities/prc-structure-2-evaluation-entity.interface';
import {BasicsProcurementStructureEvaluationDataService} from './basics-procurement-structure-evaluation-data.service';



/**
 * validation service for ProcurementStructure evaluation
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureAccountValidationService extends BaseValidationService<IPrcStructure2EvaluationEntity> {
    private dataService = inject(BasicsProcurementStructureEvaluationDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcStructure2EvaluationEntity> {
        return {
            validateCompanyFk: this.validateCompanyFk,
            validateBpdEvaluationSchemaFk: this.validateBpdEvaluationSchemaFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructure2EvaluationEntity> {
        return this.dataService;
    }

    protected validateCompanyFk(info: ValidationInfo<IPrcStructure2EvaluationEntity>): ValidationResult {
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
                CompanyFk: <number>info.value,
                BpdEvaluationSchemaFk: info.entity.BpdEvaluationSchemaFk
            }, {
                key: 'basics.procurementstructure.towFiledUniqueValueErrorMessage',
                params: {field1: 'Company', field2: 'Evaluation Schema'}
            });
        }
        return result;
    }

    protected validateBpdEvaluationSchemaFk(info: ValidationInfo<IPrcStructure2EvaluationEntity>): ValidationResult {
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
                CompanyFk: info.entity.CompanyFk,
                BpdEvaluationSchemaFk: <number>info.value
            }, {
                key: 'basics.procurementstructure.towFiledUniqueValueErrorMessage',
                params: {field1: 'Company', field2: 'Evaluation Schema'}
            });
        }
        return result;
    }
}
