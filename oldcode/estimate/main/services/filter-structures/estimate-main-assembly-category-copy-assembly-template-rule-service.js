/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainAssemblyCategoryCopyAssemblyTemplateRuleService', [
		'$http', '$injector', '$q', 'estimateMainCommonCopyAssemblyTemplateRuleService',
		function ($http, $injector, $q, estimateMainCommonCopyAssemblyTemplateRuleService) {
			let service = {};
			let categoriesList = null;

			function getCategoriesList(){
				if(categoriesList === null || !angular.isArray(categoriesList) || categoriesList.length <= 0){
					categoriesList = $injector.get('estimateMainAssembliesCategoryService').getList();
				}

				return  categoriesList;
			}

			function getAssemblyCategoryOfEstimate(estAssemblyCatFk){
				let category = null;
				if(estAssemblyCatFk === undefined || estAssemblyCatFk === null) {
					return category;
				}

				let categories = getCategoriesList();
				if (_.isArray(categories) || estAssemblyCatFk) {
					if (categories.length === 0) {
						// try once more to get data
						categories = getCategoriesList();
					}
					if (_.isArray(categories)) {
						category = _.find(categories, {Id: estAssemblyCatFk});
						if(category && !category.IsShowInLeading) {
							category = null;
						}
					}
				}

				return category;
			}

			function getParameters(assemblyEstHeaderFk, assemblyCategoryFk){
				let opt = {
					estHeaderFk: assemblyEstHeaderFk,
					mainItemId: assemblyCategoryFk,
					itemName: ['EstAssemblyCat']
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/getparametersforestitem', opt);
			}

			function assignAssemblyCategoryRules(assembly, lineItem){
				if(assembly === undefined || assembly === null) {
					return;
				}
				let destCategory = getAssemblyCategoryOfEstimate(assembly.EstAssemblyCatFk);
				if(destCategory === undefined || destCategory === null) {
					return;
				}

				let ruleRelationService = $injector.get('estimateAssembliesCategoryMdcRuleRelationService');
				let assignedRules = estimateMainCommonCopyAssemblyTemplateRuleService.filterRulesFromProjectEstimateRules(destCategory, ruleRelationService);

				let estimateMainAssembliesCategoryService = $injector.get('estimateMainAssembliesCategoryService');
				let promiseGetRuleList = null;
				promiseGetRuleList = ruleRelationService.getListAsync(assembly.EstHeaderFk);
				promiseGetRuleList.then(function(){
					promiseGetRuleList = null;
					// let result = response.data;
					assignedRules = estimateMainCommonCopyAssemblyTemplateRuleService.filterRulesFromProjectEstimateRules(destCategory, ruleRelationService);

					estimateMainCommonCopyAssemblyTemplateRuleService.assignEstRulesToItem(assignedRules, destCategory, estimateMainAssembliesCategoryService);
				},
				function(){
				}
				);

				let promises = [];
				promises.push(getParameters(assembly.EstHeaderFk, destCategory.Id));
				promises.push(getParameters(lineItem.EstHeaderFk, destCategory.Id));
				promises.push(estimateMainCommonCopyAssemblyTemplateRuleService.getParametersOfRules(assignedRules, lineItem.ProjectFk));
				$q.all(promises).then(function () {
					let sourceParams = promises[0].$$state.value.data.EstAssemblyCatParam;
					sourceParams = estimateMainCommonCopyAssemblyTemplateRuleService.mergeParameters(sourceParams, promises[2].$$state.value);
					let destParams = promises[1].$$state.value.data.EstAssemblyCatParam;

					let creationData = {
						itemName: ['EstAssemblyCat'],
						item: destCategory,
						estHeaderFk: lineItem.EstHeaderFk
					};
					estimateMainCommonCopyAssemblyTemplateRuleService.assignParameterFromProjectEstimateRules(sourceParams, creationData, estimateMainAssembliesCategoryService, destParams);
				});
			}

			angular.extend(service, {
				assignAssemblyCategoryRules: assignAssemblyCategoryRules
			});

			return service;
		}
	]);

})(angular);
