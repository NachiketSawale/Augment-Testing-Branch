/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {IEstLineItemEntity} from '@libs/estimate/interfaces';
import { ProjectPlantAssemblyMainService } from '../containers/assemblies/project-plant-assembly-main.service';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { ProjectMainDataService} from '@libs/project/shared';
import {EstimateMainService} from '@libs/estimate/main';
import { EstimateParameterUpdateService } from '@libs/estimate/parameter';
import { IValidationOptions } from '../model/interfaces/project-plant-assembly-validation-option.interface';

@Injectable({
    providedIn: 'root',
})

/**
 * @class projectPlantAssemblyValidationService
 * @brief Service provides validation methods for project Plant Assembly properties
 */
export abstract class projectPlantAssemblyValidationService extends BaseValidationService<IEstLineItemEntity> {
    private projectPlanAssemblyMainService = inject(ProjectPlantAssemblyMainService);
    protected http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);
    private validationService = inject(BasicsSharedDataValidationService);
    private readonly projectMainDataService = inject(ProjectMainDataService);
    private readonly estimateMainService = inject(EstimateMainService);
    protected readonly estimateParamUpdateService = inject(EstimateParameterUpdateService);

    /**
     * Generates the validation functions for Project plant Assembly.
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IEstLineItemEntity> {
        return {
           // asyncValidateRule: this.asyncValidateRule,
            QuantityFactor1: [this.generateValidateItem('QuantityFactor1')],
            QuantityFactor2: [this.generateValidateItem('QuantityFactor2')],
            QuantityFactor3: [this.generateValidateItem('QuantityFactor3')],
            QuantityFactor4: [this.generateValidateItem('QuantityFactor4')],
            CostFactor1: [this.generateValidateItem('CostFactor1')],
            CostFactor2: [this.generateValidateItem('CostFactor2')],
        };
    }

    /**
     * Asynchronously validates if the Quantity Factors and Cost Factors.
     * @param field Validation information for the plant assembly entity.
     * @returns ValidationResult indicating the validation result.
     */
    private generateValidateItem(field: keyof IEstLineItemEntity) {
        return (info: ValidationInfo<IEstLineItemEntity>) => {
            return this.valueChangeValidation(info);
        };
    }

    private valueChangeValidation(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
        const validResult = {
            apply: false,
            valid: true,
            error: '...',
            error$tr$: 'cloud.common.greaterValueErrorMessage',
            error$tr$param$: {object: info.field, value: '0'}
        };

        const isEmpty = this.validationService.isEmptyProp(info.value);
        const value = info.value as number;
        if (isEmpty || ( value < 1)) {
            return Promise.resolve(validResult);
        } else {
            const applyValidResult = {
                apply: true,
                valid: true
            };
            return Promise.resolve(applyValidResult);
        }
    }

    /**
     * Validates the rule async mandatory
     * @param info Validation information for the Plant Assembly entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected asyncValidateRule(info: ValidationInfo<IEstLineItemEntity>) {
        {
          //  let rulePromise = null;
          const options: IValidationOptions | null = null;
            //TODO
            /* let containerData = projectMainService.getContainerData();
            let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
            let updateData = modTrackServ.getModifications(projectMainService);
            */

            

            if (!options) {
                //options = {};
                options!.DataServiceMethod = 'getItemByRuleAsync';
                options!.DataServiceName = 'estimateRuleFormatterService';
                options!.ItemName = 'EstLineItems';
                options!.ItemServiceName = 'projectPlantAssemblyMainService';
                options!.ServiceName = 'basicsCustomizeRuleIconService';
                options!.ValidItemName = 'EstLineItems';
            }

            // Overwrite
            // options.itemServiceName='projectAssemblyMainService'; //'estimateMainService';                                                  
            // if (options && options.itemServiceName) {
            //     //updateData.EstLeadingStructureContext = this.estimateParamUpdateService.getLeadingStructureContext({}, info.entity, options.itemServiceName);
            //     //updateData.MainItemName = options.itemName;
            // }

            //TODO
            /*    let asyncMarker = platformDataValidationService.registerAsyncCall(info.entity, info.value, model, estimateMainService);
            if (!rulePromise) {
                rulePromise = this.http.post(containerData.httpUpdateRoute + containerData.endUpdate, updateData);
                asyncMarker.myPromise = rulePromise;
            }*/

            // return rulePromise.then((response)=> {                                                                       // TODO:  response type
            //         rulePromise = null;
            //         const result = response.data;
            //        // containerData.onUpdateSucceeded(result, containerData, updateData);
            //         // clear updateData
            //        // let projectMainService = $injector.get('projectMainService');
            //        // modTrackServ.clearModificationsInRoot(projectMainService);
            //        // updateData = {};

            //     //todo RuleAssignment
            //         if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || (_.find(info.entity, function (item) {
            //            // return 1;
            //             //todo
            //             //return !!item.FormFk;
            //             return !!item;
            //         }))) {
            //             result.IsUpdated = true;
            //             //result.containerData = containerData;
            //             result.isFormula = false;
            //             result.options = options;
            //             result.entity = info.entity;
            //             result.MainItemName = options.itemName;
            //            // result.EstLeadingStuctureContext = updateData.EstLeadingStructureContext ? updateData.EstLeadingStructureContext :
            //                 this.estimateParamUpdateService.getLeadingStructureContext(item, info.entity, options.itemServiceName, options.itemName);
            //             //result.EstLeadingStuctEntities = angular.copy(options.selectedItems);
            //             result.fromModule = 'Project';// 'EstLineItem';
            //         }

            //         if (result.FormulaParameterEntities && result.FormulaParameterEntities.length) {
            //             _.forEach(result.FormulaParameterEntities, function (parameter) {
            //                 parameter.IsPrjAssembly = true;
            //             });
            //         }

            //         result.ProjectId = result.ProjectId || this.projectMainDataService.getSelection()[0].Id;

            //         // merge new estimate rule to project rule and add a user form data if need.
            //        const estRules =null;
            //         // const estRules = info.entity.RuleAssignment.filter(function (item) {
            //          //   return !item.IsPrjRule;
            //        // });
            //         const allPermisson = [];
            //         if (estRules && result.PrjEstRuleToSave) {
            //             _.forEach(estRules, function (item) {
            //                 const prjRule = result.PrjEstRuleToSave.find(function (r) {
            //                     return r.Code === item.Code;
            //                 });
            //                 if (prjRule) {
            //                     item.OriginalMainId = item.MainId = prjRule.MainId;
            //                     item.IsPrjRule = true;
            //                 }

            //                 if (item.FormFk && item.MainId) {
            //                     const completeDto = {formFk: item.FormFk, contextFk: item.MainId, rubricFk: 79};
            //                     allPermisson.push(this.http.post(this.configurationService.webApiBaseUrl + 'basics/userform/data/saveruleformdata', completeDto));
            //                 }
            //             });
            //         }
            //         const includeUserForm =null;
            //         /* const includeUserForm = !!_.find(info.entity.RuleAssignment, function (item) {
            //              return !!item.FormFk;
            //          });*/
            //         if (allPermisson.length > 0) {
            //           return new Promise (resolve =>  {
            //                 if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm) {
            //                     //let paramDialogService = inject('estimateMainDetailsParamDialogService');
            //                    // $injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService(this.projectPlanAssemblyMainService);
            //                  //   paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
            //                 }
            //             });
            //         } else {
            //             if ((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm) {
            //                 //let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
            //                // $injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService(this.projectPlanAssemblyMainService);
            //                // paramDialogService.showDialog(result, this.estimateMainService.getDetailsParamReminder());
            //             }
            //         }

            //         // Merge result into data on the client.
            //         //platformRuntimeDataService.applyValidationResult(true, info.entity, 'Rule');
            //         //return platformDataValidationService.finishAsyncValidation(true, info.entity, value, model, asyncMarker, service, estimateMainService);
            //     },
            //     // when failed to update, this function will be excuted, this make the asyncValidate can return
            //     // if no this wrong response function, the rule column validate can't return and remove the pending-validation css, as that make always loading errors
            //     function () {
            //         // handler the reponse which failed to update. The rule validation is still ok even failed updated
            //         //platformRuntimeDataService.applyValidationResult(true, info.entity, 'Rule');
            //        // return platformDataValidationService.finishAsyncValidation(true, info.entity, info.value, model, asyncMarker, service, estimateMainService);
            //     }
            // );
        }
    }
}
