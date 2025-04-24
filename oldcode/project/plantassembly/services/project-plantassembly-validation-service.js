/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	/**
     * @ngdoc service
     * @name projectPlantAssemblyValidationService
     * @description provides validation methods for project Plant Assembly properties
     */
	angular.module('project.plantassembly').factory('projectPlantAssemblyValidationService', ['_','platformDataValidationService', 'projectAssemblyMainService','projectPlantAssemblyMainService','estimateAssembliesValidationServiceFactory',
		function (_,validationService, dataService,projectPlantAssemblyMainService,estimateAssembliesValidationServiceFactory) {

			let service = {};
			let rulePromise = null;

			service = estimateAssembliesValidationServiceFactory.createEstAssembliesValidationService(projectPlantAssemblyMainService, true);

			angular.extend(service, {
				asyncValidateRule: asyncValidateRule
			});

			let mandatoryFields = [
				'QuantityFactor1',
				'QuantityFactor2',
				'QuantityFactor3',
				'QuantityFactor4',
				'CostFactor1',
				'CostFactor2'
			];

			let generateValidateItem = function (field) {
				return function (entity, value) {
					let isEmpty = validationService.isEmptyProp(value);
					if(isEmpty || value < 1){
						return validationService.finishValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.greaterValueErrorMessage',
							error$tr$param$: { object: field, value: '0' }
						}, entity, value, field, service, dataService);
					}
					else {
						return validationService.finishValidation({
							valid: true
						}, entity, value, field, service, dataService);
					}
				};
			};

			_.each(mandatoryFields, function (field) {
				service['validate' + field] = generateValidateItem(field);
			});

			function asyncValidateRule(entity, value, model, options) {
				var projectMainService = $injector.get('projectMainService');

				let containerData = projectMainService.getContainerData();
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				let updateData = modTrackServ.getModifications(projectMainService);
				// updateData.EstLineItem = entity && entity.hasOwnProperty('IsGc') ? entity : updateData.EstLineItem;

				if(!options){
					options={};
					options.dataServiceMethod ='getItemByRuleAsync';
					options.dataServiceName='estimateRuleFormatterService';
					options.itemName='EstLineItems';
					options.itemServiceName='projectPlantAssemblyMainService';
					options.serviceName='basicsCustomizeRuleIconService';
					options.validItemName='EstLineItems';
				}

				// Overwrite
				// options.itemServiceName='projectAssemblyMainService'; //'estimateMainService';

				if(options && options.itemServiceName){
					updateData.EstLeadingStructureContext= estimateParamUpdateService.getLeadingStructureContext({}, entity, options.itemServiceName);
					updateData.MainItemName = options.itemName;
				}

				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);
				if(!rulePromise){
					rulePromise = $http.post(containerData.httpUpdateRoute + containerData.endUpdate, updateData);
					asyncMarker.myPromise = rulePromise;
				}
				return rulePromise.then(function(response){
					rulePromise = null;
					let result = response.data;
					containerData.onUpdateSucceeded(result, containerData, updateData);
					// clear updateData
					let projectMainService = $injector.get('projectMainService');
					modTrackServ.clearModificationsInRoot(projectMainService);
					updateData = {};

					if((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || (_.find(entity.RuleAssignment, function (item) { return !!item.FormFk;}))){
						result.IsUpdated = true;
						result.containerData = containerData;
						result.isFormula = false;
						result.options = options;
						result.entity = entity;
						result.MainItemName = options.itemName;
						result.EstLeadingStuctureContext = updateData.EstLeadingStructureContext ? updateData.EstLeadingStructureContext :
							estimateParamUpdateService.getLeadingStructureContext({}, entity, options.itemServiceName);
						result.EstLeadingStuctEntities = angular.copy(options.selectedItems);
						result.fromModule = 'Project';// 'EstLineItem';
					}

					if(result.FormulaParameterEntities && result.FormulaParameterEntities.length){
						_.forEach(result.FormulaParameterEntities, function (parameter){
							parameter.IsPrjAssembly = true;
						});
					}

					result.ProjectId = result.ProjectId || projectMainService.getSelected().Id;

					// merge new estimate rule to project rule and add a user form data if need.
					let estRules = entity.RuleAssignment.filter(function (item) {
						return !item.IsPrjRule;
					});
					let allPermisson = [];
					if(estRules && result.PrjEstRuleToSave){
						_.forEach(estRules, function (item) {
							let prjRule = result.PrjEstRuleToSave.find(function (r) { return r.Code === item.Code; });
							if(prjRule){
								item.OriginalMainId = item.MainId = prjRule.MainId;
								item.IsPrjRule = true;
							}

							if(item.FormFk && item.MainId){
								let completeDto = {formFk:item.FormFk, contextFk:item.MainId, rubricFk: 79};
								allPermisson.push($http.post(globals.webApiBaseUrl + 'basics/userform/data/saveruleformdata', completeDto));
							}
						});
					}
					let includeUserForm = !!_.find(entity.RuleAssignment, function (item) { return !!item.FormFk;});
					if(allPermisson.length > 0){
						$q.all(allPermisson).then(function () {
							if((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm){
								let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
								$injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService(projectPlantAssemblyMainService);
								paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
							}
						});
					}else{
						if((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm){
							let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
							$injector.get('estimateMainDetailsParamListValidationService').setCurrentDataService(projectPlantAssemblyMainService);
							paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
						}
					}

					// Merge result into data on the client.
					platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, estimateMainService);
				},
				// when failed to update, this function will be excuted, this make the asyncValidate can return
				// if no this wrong response function, the rule column validate can't return and remove the pending-validation css, as that make always loading errors
				function(){
					// handler the reponse which failed to update. The rule validation is still ok even failed updated
					platformRuntimeDataService.applyValidationResult(true, entity, 'Rule');
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, estimateMainService);
				}
				);
			}

			return service;
		}
	]);

})(angular);
