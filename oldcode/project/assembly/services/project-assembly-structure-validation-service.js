/**
 * Created by lnt on 26.08.2021.
 */

(function () {
	'use strict';
	/* global angular, globals, _ */

	let moduleName = 'project.assembly';

	/**
	 * @ngdoc service
	 * @name projectAssemblyStructureValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('projectAssemblyStructureValidationService', [
		'$injector', '$http', '$q', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateAssembliesStructureValidationServiceFactory', 'projectAssemblyStructureService', 'projectAssemblyMainService', 'estimateMainService', 'estimateParamUpdateService',
		function ($injector, $http, $q, platformDataValidationService, platformRuntimeDataService, estimateAssembliesStructureValidationServiceFactory, projectAssemblyStructureService, projectAssemblyMainService, estimateMainService, estimateParamUpdateService) {

			let service = {},
				rulePromise = null,
				validationResult = {valid : true};

			service = estimateAssembliesStructureValidationServiceFactory.createAssemblyStructureValidationService(projectAssemblyStructureService, projectAssemblyMainService);

			angular.extend(service, {
				asyncValidateRule: asyncValidateRule
			});

			return service;

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
					options.itemName='EstAssemblyCat';// 'EstLineItems';
					options.itemServiceName='projectAssemblyStructureService';// 'estimateMainService';
					options.serviceName='basicsCustomizeRuleIconService';
					options.validItemName= 'EstAssemblyCat';// 'EstLineItems';
				}

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
					// clear updateData
					let projectMainService = $injector.get('projectMainService');
					modTrackServ.clearModificationsInRoot(projectMainService);
					updateData = {};

					if((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || (_.find(entity.RuleAssignment, function (item) { return !!item.FormFk;}))){
						result.IsUpdated = true;
						result.containerData = containerData;
						result.isFormula = false;
						result.options = options || {};
						result.entity = entity;
						result.MainItemName = options.itemName;
						result.EstLeadingStuctureContext = updateData.EstLeadingStructureContext ? updateData.EstLeadingStructureContext :
							estimateParamUpdateService.getLeadingStructureContext({}, entity, options.itemServiceName);
						result.EstLeadingStuctEntities = angular.copy(options.selectedItems);
						result.fromModule = 'Project';// 'EstLineItem';

						if (result.EstAssemblyCatRuleToSave && result.EstAssemblyCatRuleToSave.length){
							result.EstHeaderId = _.first(_.map(result.EstAssemblyCatRuleToSave, 'EstHeaderFk'));
							result.ProjectId = entity.PrjProjectFk;

							result.options.projectFk = entity.PrjProjectFk;
							result.options.estHeaderFk = result.EstHeaderId;
							result.options.isPrjAssembly = true;
							$injector.get('estimateParameterFormatterService').setSelectedProject(entity.PrjProjectFk);
						}
					}

					if(result.FormulaParameterEntities && result.FormulaParameterEntities.length){
						_.forEach(result.FormulaParameterEntities, function (parameter){
							parameter.IsPrjAssemblyCat = true;
						});
					}

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
								paramDialogService.showDialog(result, estimateMainService.getDetailsParamReminder());
							}
						});
					}else{
						if((result.FormulaParameterEntities && result.FormulaParameterEntities.length) || includeUserForm){
							let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
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
		}

	]);

})();
