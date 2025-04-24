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
import { IEstimateParameter } from '../../model/estimate-parameter.interface';
import {each} from 'lodash';
import {PlatformTranslateService} from '@libs/platform/common';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { EstimateParamComplexLookupDataService } from '../lookups/estimate-parameter-complex-lookup/estimate-parameter-complex-lookup-data.service';

@Injectable({
    providedIn: 'root'
})

/**
 * EstimateParamComplexLookupCommonService provides validation methods for estimate parameter
 */
export class EstimateParameterComplexLookupValidationService extends BaseValidationService<IEstimateParameter> {

    //TODO Check Param Data Service
    private readonly estimateParamComplexLookupDataService = inject(EstimateParamComplexLookupDataService);
    public readonly translate = inject(PlatformTranslateService);
    private readonly validationUtils = inject(BasicsSharedDataValidationService);
    protected readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

    public validation = {issues : [] as ValidationResult[] };

    protected generateValidationFunctions(): IValidationFunctions<IEstimateParameter> {
        return {
            //TODO Add Code column validation
           // Code: this.validateCode
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstimateParameter> {
        return this.estimateParamComplexLookupDataService;
    }

    /**
     * @name validateCode
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description ValidateCode
     */
    public validateCode(info: ValidationInfo<IEstimateParameter>, updateData : IEstimateParameter[], isIgnoreInitRedIcon : boolean): ValidationResult {
        let count = 0;
        let result= new ValidationResult();

        if (updateData && updateData.length > 0) {
          each(updateData, function (param) {
                if (param.Code && info.value && param.Code.toLowerCase() === info.value && param.Id !== info.entity.Id) {
                    count++;
                }
            });
        }

        if (info.value === '...' || count > 0 || info.value === '') {
            if (info.value === '...' || info.value === '') {
                //TODO
                //result = this.validationUtils.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', {object: model.toLowerCase()});
            } else {
                //TODO
                //result =this.validationUtils.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()});
            }

            //TODO need to check required or not
         /*   result.entity = entity;
            result.value = value;
            result.model = model;
            result.valideSrv = this;
            result.dataSrv = this.estimateParamDataService;*/
            this.validation.issues.push(result);
        } else {
            result = this.validationUtils.createSuccessObject();
            //this.validation.issues = filter(this.validation.issues, function (err : ValidationInfo<IEstimateParameter>) {
             //   return err.entity.Id !== info.entity.Id || err.field !== info.field;
          //  });
        }

        const rootServices = ['estimateMainBoqService', 'estimateMainRootService', 'estimateMainActivityService'];
        //TODO || entity.IsEstHeaderRoot
        if ((info.entity.IsRoot ) && !isIgnoreInitRedIcon) {
           each(rootServices, function (serv) {
                if (serv) {
                    //TODO Check root service
                 /*   let rootService = $injector.get(serv);
                    let affectedRoot = find(rootService.getList(), {IsRoot: true});
                    if (!affectedRoot) {
                        affectedRoot = find(rootService.getList(), {IsEstHeaderRoot: true});
                    }
                    if (affectedRoot) {
                        affectedRoot.Param = entity.Param;
                        rootService.fireItemModified(affectedRoot);
                    }*/
                }
            });
        }

        //this.basicsSharedDataValidationService.applyValidationResult(this.estimateParamDataService,{entity, model,result});
        return result;
    }

    /**
     * @name validateValueDetail
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Validate Value Detail
     */
    public validateValueDetail(info: ValidationInfo<IEstimateParameter>) {
        //TODO
        const result = this.validationUtils.createSuccessObject();

        //info.value = info.value === null ? '' : info.value;
      /*  let paramslist = this.estimateParamDataService.getList();

        let valueTypes = EstimateRuleParameterConstant;
        let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
        let isMapCulture = true;

        let parameterReference = {};

        entity[field] = value;
        let paramReference = {isLoop: false, linkReference: ''};
        estimateRuleCommonService.checkLoopReference(entity, this.estimateParamDataService, paramReference);
        if (paramReference.isLoop) {
            result.valid =false;
            result.error =this.translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference});

            this.basicsSharedDataValidationService.applyValidationResult(result, entity, field);
            return result;
        }

        if (entity.ValueType !== valueTypes.Text) {
            isMapCulture = commonCalculationSer.getIsMapCulture(value);
            parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramslist, value);
            if (parameterReference.invalidParam) {
                //TODO need to check required or not

                result.error = parameterReference.error;
                result.entity = entity;
                result.value = value;
                result.model = field;
                result.valideSrv = this;
                result.dataSrv = this.estimateParamDataService;*!/
                result.valid = false;
                entity.nonVallid = true;

                this.basicsSharedDataValidationService.applyValidationResult(result, entity, field);
                return result;
            }
        }
        if (!isMapCulture) {
            result = {
                apply: true,
                valid: false,
                error: this.translate.instant('cloud.common.computationFormula')
            };
            // isValid = true;
        } else {
            let ParamDataServ = this.estimateParamDataService;
            let isBoolean = estimateRuleCommonService.isBooleanType(value, ParamDataServ);
            if (isBoolean) {
                result = this.validationUtils.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
                //TODO need to check required or not
                result.entity = entity;
                result.value = value;
                result.model = field;
                result.valideSrv = this;
                result.dataSrv = ParamDataServ;
                // isValid = true;
                this.validation.issues.push(result);
            } else {
                this.validation.issues = filter(this.validation.issues, function (err) {
                    return err.entity.Id !== entity.Id || err.model !== field;
                });
                this.basicsSharedDataValidationService.applyValidationResult(result, entity, 'ParameterValue');
                // isValid = false;

            }
        }

        this.basicsSharedDataValidationService.applyValidationResult(result, entity, field);*/
        return result;
    }

    /**
     * @name asyncValidateValueDetail
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Async Validate Value Detail
     */
   public asyncValidateValueDetail(info: ValidationInfo<IEstimateParameter>) {
        //TODO estimateRuleCommonService
      /*  let asyncMarker = this.validationUtils.registerAsyncCall(entity, value, model, this.estimateParamDataService);

        asyncMarker.myPromise = estimateRuleCommonService.getAsyncParameterDetailValidationResult(entity, value, model, estimateParamDataService).then(function (data) {
            if (data.valid) {
                this.validation.issues = filter(this.validation.issues, function (err) {
                    return err.entity.Id !== entity.Id || err.model !== model;
                });
            } else {
                data.entity = entity;
                data.value = value;
                data.model = model;
                data.valideSrv = service;
                data.dataSrv = this.estimateParamDataService;
                this.validation.issues.push(data);
            }

            return data;
        });

        return asyncMarker.myPromise;*/
    }

    /**
     * @name validateDefaultValue
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Validate Default Value
     */
    public validateDefaultValue (info: ValidationInfo<IEstimateParameter>) {
        return this.validationUtils.isMandatory(info);
    }

    /**
     * @name setParamOptions
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Set Param Options
     */
    public setParamOptions() {
        // paramOptions = opt;
    }

    /**
     * @name getValidationIssues
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Get Validation Issues
     */
    public getValidationIssues() {
        return this.validation.issues;
    }

    /**
     * @name validateParameterValue
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Validate Parameter Value
     */
    public validateParameterValue(info: ValidationInfo<IEstimateParameter>) {
        if (info.entity.__rt$data && info.entity.__rt$data.errors) {
            const error = info.entity.__rt$data.errors;
            if (error) {
                this.removeFieldError(info);
            }
        }

        //TODO
        //let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
        //let paramValueList = estimateMainParameterValueLookupService.getList();
        //return $injector.get('estimateRuleCommonService').validateParameterValue(this, entity, value, field, paramValueList);
    }

    /**
     * @name validateValueType
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description Validate Value Type
     */
   public validateValueType(info: ValidationInfo<IEstimateParameter>) {
        if (info.entity.__rt$data && info.entity.__rt$data.errors) {
            const error = info.entity.__rt$data.errors;
            if (error) {
               // entity.ValueDetail = '';
                this.removeFieldError(info);
            }
        }
   }

    /**
     * @name validateIsLookup
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description  validate is lookup or not
     */
   public validateIsLookup(info: ValidationInfo<IEstimateParameter>) {
        if (info.value) {
            if (info.entity.__rt$data && info.entity.__rt$data.errors) {
                const error = info.entity.__rt$data.errors;
                if (error) {
                  //  entity.ValueDetail = '';
                    this.removeFieldError(info);
                }
            }
        }
   }

    /**
     * @name removeFieldError
     * @methodOf EstimateParameterComplexLookupValidationService
     * @description remove field error
     */
    private removeFieldError(info: ValidationInfo<IEstimateParameter>) {
        //TODO
        // this.basicsSharedDataValidationService.applyValidationResult({valid: true}, entity, field);
        // this.basicsSharedDataValidationService.finishValidation({valid: true}, entity, '', field, this, this.estimateParamDataService);
    }
}
