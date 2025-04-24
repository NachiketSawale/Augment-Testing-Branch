/*
 * Copyright(c) RIB Software GmbH
 */

import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
import {isNull, merge} from 'lodash';
import {inject} from '@angular/core';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export abstract class EstimateRuleBaseValidationService extends BaseValidationService<IEstRuleEntity>{
    private _length: number = 24;

    protected translate = inject(PlatformTranslateService);
    private readonly validationUtils = inject(BasicsSharedDataValidationService);
    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);

    protected abstract generateCustomizeValidationFunctions():IValidationFunctions<IEstRuleEntity>|null;

    protected constructor(protected dataService:IEntityRuntimeDataRegistry<IEstRuleEntity>) {
        super();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstRuleEntity> {
        return this.dataService;
    }

    protected generateValidationFunctions():IValidationFunctions<IEstRuleEntity>{
        const customizeValidationFunctions = this.generateCustomizeValidationFunctions();
        if(isNull(customizeValidationFunctions)){
            return this.getCommonValidationFunctions();
        }
        return merge(this.getCommonValidationFunctions(), customizeValidationFunctions);
    }

    public setMaxCodeLength (length: number){
        this._length = length;
        if(this._length <=0 || this._length > 24){
            this._length = 24;
        }
    }

    protected getCommonValidationFunctions(): IValidationFunctions<IEstRuleEntity> {
        return {
            EstEvaluationSequenceFk: this.validateEstEvaluationSequenceFk,
            Code: this.asyncValidateCode,
            Icon: this.validateIcon,
            EstRuleExecutionTypeFk: this.validateEstRuleExecutionTypeFk,
            IsForEstimate: this.asyncValidateIsForEstimate,
            IsForBoq: this.asyncValidateIsForBoq
        };
    }

    protected validateEstEvaluationSequenceFk(info: ValidationInfo<IEstRuleEntity>) {
        return this.validationUtils.isMandatory(info);
    }

    // protected validateCode(info: ValidationInfo<IEstRuleEntity>){
    //     const result = this.validationUtils.isMandatory(info);
    //     const value = info.value as string;
    //     if(result.valid){
    //         if(value.length > this._length){
    //             result.valid = false;
    //             result.error = this.translate.instant('estimate.rule.errors.ruleCodeMaxLength').text;
    //         }
    //     }
    //     return result;
    // }

    protected validateIcon(info: ValidationInfo<IEstRuleEntity>) {
        let result;
        const entity = info.entity;
        const value: number = info.value as number;
        if(this.isValidValue(entity.Icon, value)){
            result = this.validationUtils.createSuccessObject();
        } else {
            result = this.validationUtils.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
        }

        return result;
    }

    protected validateEstRuleExecutionTypeFk(info: ValidationInfo<IEstRuleEntity>) {
        let result;
        const entity = info.entity;
        const value: number = info.value as number;
        if(this.isValidValue(entity.Icon, value)){
            result = this.validationUtils.createSuccessObject();
        } else {
            result = this.validationUtils.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
        }
        return result;
    }

    private isValidValue(value: number | null | undefined, comparisonValue: number): boolean {
        return (
            value !== undefined &&
            value !== null &&
            (value > 0 || (value === 0 && comparisonValue > 0))
        );
    }

    protected async asyncValidateCode(info: ValidationInfo<IEstRuleEntity>): Promise<ValidationResult> {
        const postData = {
            Id: info.entity.Id,
            Code: info.value,
            MdcLineItemContextFk: info.entity.MdcLineItemContextFk};// Call data prepared
        const result = this.validationUtils.isMandatory(info);
        const value = info.value as string;

        if(result.valid){
            if(value.length > this._length){
                result.valid = false;
                result.error = this.translate.instant('estimate.rule.errors.ruleCodeMaxLength').text;
            }
        }

        if (!result.valid) {
            return result;
        }else {
            const url = this.configurationService.webApiBaseUrl + 'estimate/rule/estimaterule/isuniquecode';
            const response = await firstValueFrom(this.http.post(url, postData));
            if(response){
                const isUnique = response as boolean;
                if (isUnique) {
                    result.apply = true;
                    result.valid = true;
                } else {
                    result.apply = true;
                    result.valid = false;
                    result.error = this.translate.instant('estimate.rule.errors.uniqCode').text;
                }
            }
            return result;
        }

    }

    protected asyncValidateIsForEstimate(info: ValidationInfo<IEstRuleEntity>){
        this.resolveBulkUpdateOnRuleChecked(info);
        return this.validationUtils.createSuccessObject();
    }

    protected asyncValidateIsForBoq(info: ValidationInfo<IEstRuleEntity>){
        this.resolveBulkUpdateOnRuleChecked(info);
        return this.validationUtils.createSuccessObject();
    }

    // TODO Will be completed in the future
    private resolveBulkUpdateOnRuleChecked(info: ValidationInfo<IEstRuleEntity>): Promise<boolean> {
        // const rulesEntities = this.dataService;
        // const field = info.field;
        // const value: boolean = info.value as boolean;
        // const entity = info.entity;
        // if (rulesEntities.length === 1){
        //     return Promise.resolve(true);
        // }
        // rulesEntities.forEach(ruleEntity => {
        //     set(ruleEntity,field,value);
        //     // ruleEntity[field] = value;
        //     // estimateRuleService.markItemAsModified(ruleEntity);
        // });
        // return this.estimateRuleService.bulkUpdateOnRuleChecked(entity, value, field, false);
        return Promise.resolve(true);
    }

}