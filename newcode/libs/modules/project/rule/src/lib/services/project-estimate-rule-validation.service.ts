import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo
} from '@libs/platform/data-access';
import { ProjectEstimateRuleDataService } from './project-estimate-rule-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {cloneDeep, isNull, isUndefined} from 'lodash';
import {PlatformTranslateService} from '@libs/platform/common';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';


@Injectable({
    providedIn: 'root'
})
export class ProjectEstimateRuleValidationService extends BaseValidationService<IProjectEstimateRuleEntity>{
    private readonly dataService: ProjectEstimateRuleDataService = inject(ProjectEstimateRuleDataService);
    private readonly validationUtils = inject(BasicsSharedDataValidationService);
    private translate = inject(PlatformTranslateService);

    public _length: number = 24;

    protected generateValidationFunctions(): IValidationFunctions<IProjectEstimateRuleEntity> {
        return {
            BasRubricCategoryFk: this.validateBasRubricCategoryFk,
            Code: this.validateCode,
            EstRuleExecutionTypeFk: this.validateEstRuleExecutionTypeFk,
        };
    }

    protected async validateBasRubricCategoryFk(info: ValidationInfo<IProjectEstimateRuleEntity>) {
        return this.validationUtils.isMandatory(info);
    }

    // ToDo validationUtils is not in BasicsSharedDataValidationService and check Custom error messages
    protected async validateCode(info: ValidationInfo<IProjectEstimateRuleEntity>) {
        // const fieldToValidate = 'Code';
        const oldPrjRule = cloneDeep(info.entity);
        const entity = info.entity;
        entity.oldCode = oldPrjRule.Code;
        entity.isUniq = true;
        let value = info.value as string;
        if(value){
            value = value.toUpperCase();
        }
        // let result = this.validationUtils.validateMandatoryUniqEntity(entity, value, fieldToValidate, estimateProjectEstimateRulesService.getList(), service, estimateProjectEstimateRulesService);
        const result = {
            valid: true
        };
        if(!result.valid){
            entity.isUniq = false;
        }

        if(result.valid){
            if(value.length > this._length){
                result.valid = false;
                // result.error = this.translate.instant('project.main.ruleCodeMaxLength', {count: this._length}).text;
                // result.error$tr$ = this.translate.instant('project.main.ruleCodeMaxLength', {count: this._length}).text;
            }
        }
        // platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
        // return platformDataValidationService.finishValidation(result, entity, entity.Code, model, service, estimateProjectEstimateRulesService);
        return this.validationUtils.isMandatory(info);
    }

    protected async validateEstRuleExecutionTypeFk(info: ValidationInfo<IProjectEstimateRuleEntity>) {
        const estRuleExecutionTypeFk = info.entity.EstRuleExecutionTypeFk;
        if(isNull(estRuleExecutionTypeFk) || isUndefined(estRuleExecutionTypeFk)){
            return this.validationUtils.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
        }

        if(estRuleExecutionTypeFk > 0 ||(estRuleExecutionTypeFk === 0 && <number>info.value > 0)){
            return this.validationUtils.createSuccessObject();
        } else{
            return this.validationUtils.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
        }
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectEstimateRuleEntity> {
        return this.dataService;
    }

    public setMaxCodeLength(length: number){
       this._length = length;
        if(this._length <=0 || this._length > 24){
            this._length = 24;
        }
    }
}