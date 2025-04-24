/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemCopyAssemblyTemplateRuleService', ['$http','$injector','$q',
		'estimateMainCommonCopyAssemblyTemplateRuleService',
		function ($http, $injector,$q, estimateMainCommonCopyAssemblyTemplateRuleService){
			let service = {};

			function assignAssemblyRules(assembly, lineItem, isAssemblyToWic, overwrite) {
				let estimateMainService = $injector.get('estimateMainService');
				let ruleRelationService = $injector.get('estimateAssembliesMdcRuleRelationService');

				let assignedRules = estimateMainCommonCopyAssemblyTemplateRuleService.filterRulesFromProjectEstimateRules(assembly, ruleRelationService);
				let promiseGetRuleList = null;
				if (!assignedRules || (_.isArray(assignedRules) && assignedRules.length === 0)) {
					promiseGetRuleList = ruleRelationService.getListAsync(assembly.EstHeaderFk);
					return promiseGetRuleList.then(function () {
						promiseGetRuleList = null;
						assignedRules = estimateMainCommonCopyAssemblyTemplateRuleService.filterRulesFromProjectEstimateRules(assembly, ruleRelationService);

						estimateMainCommonCopyAssemblyTemplateRuleService.assignEstRulesToItem(assignedRules, lineItem, estimateMainService, isAssemblyToWic, overwrite);
						return resolveParameters(assembly, lineItem, estimateMainService, assignedRules);
					},
					function () {
					}
					);
				}
				else {
					estimateMainCommonCopyAssemblyTemplateRuleService.assignEstRulesToItem(assignedRules, lineItem, estimateMainService, isAssemblyToWic);
					return resolveParameters(assembly, lineItem, estimateMainService, assignedRules);
				}
			}

			function resolveParameters(assembly, lineItem, estimateMainService, assignedRules){
				let paramPromises = [];
				let promiseParam = $q.when(true);
				if (undefined === lineItem.Param) {
					let option =
						{
							dataServiceMethod: 'getItemByParamAsync',
							dataServiceName: 'estimateParameterFormatterService',
							itemName: 'EstLineItems',
							itemServiceName: 'estimateMainService',
							serviceName: 'estimateParameterFormatterService'
						};
					let formaterService = $injector.get('estimateParameterFormatterService');
					promiseParam = formaterService.getItemByParamAsync(lineItem, option);
				}

				paramPromises.push(promiseParam);
				paramPromises.push(estimateMainCommonCopyAssemblyTemplateRuleService.getParametersOfRules(assignedRules, lineItem.ProjectFk));
				return $q.all(paramPromises).then(function () {
					let creationData = {
						estHeaderFk: assembly.EstHeaderFk,
						mainItemId: assembly.Id,
						itemName: ['EstLineItems']
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/getparametersforestitem', creationData).then(function (response) {
						creationData.estHeaderFk = lineItem.EstHeaderFk;
						creationData.item = lineItem;

						let dataName = creationData.itemName + 'Param';
						let sourceParams = response.data[dataName] ? response.data[dataName] : [];
						sourceParams = estimateMainCommonCopyAssemblyTemplateRuleService.mergeParameters(sourceParams, paramPromises[1].$$state.value);

						$injector.get('estimateParamComplexLookupCommonService').clearSameParameter(lineItem,sourceParams);

						let destParams = lineItem.Param ? lineItem.Param:[];
						return estimateMainCommonCopyAssemblyTemplateRuleService.assignParameterFromProjectEstimateRules(sourceParams, creationData, estimateMainService, destParams);
					});
				});
			}

			angular.extend(service, {
				assignAssemblyRules: assignAssemblyRules
			});

			return service;
		}
	]);

})(angular);
