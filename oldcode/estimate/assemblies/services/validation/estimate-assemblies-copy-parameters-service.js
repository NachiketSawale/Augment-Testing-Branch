/**
 * Created by luy on 7/14/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, globals */

	let moduleName = 'estimate.assemblies';

	/**
     * @ngdoc service
     * @name estimateAssembliesCopyParameterService
     * @description copy parameters to multi assemblies from multi rules
     */
	angular.module(moduleName).factory('estimateAssembliesCopyParameterService', ['$http', '$injector',
		function ($http, $injector) {
			let service = {};
			let entities = [];
			let formulaParameters = [];
			let itemName = '';
			let itemService = null;
			let isRefresh = false;

			function init(validateEntities, formulaParameterEntities, mainItemName){
				entities = [];
				if(_.isArray(validateEntities)) {
					entities = validateEntities;
				} else {
					entities.push(validateEntities);
				}

				formulaParameters = [];
				if(_.isArray(formulaParameterEntities)) {
					formulaParameters = formulaParameterEntities;
				} else {
					formulaParameters.push(formulaParameterEntities);
				}

				itemName = mainItemName;
				if(itemName === 'EstLineItems'){
					itemService = $injector.get('estimateAssembliesService');
				}else if(itemName === 'EstAssemblyCat'){
					itemService = $injector.get('estimateAssembliesAssembliesStructureService');
				}else{
					itemService = null;
				}

				isRefresh = !!(entities && entities.length > 1 && formulaParameters.length > 0);
			}

			function copyParametersToAssemblies(){
				if(entities && entities.length > 1 && formulaParameters.length > 0){
					let assembly = entities.pop();
					copyParametersToAssembly(assembly).then(function () {
						copyParametersToAssemblies();
					});
				}
			}

			function copyParametersToAssembly(assembly){
				let creationData = {
					estHeaderFk: assembly.EstHeaderFk,
					itemName: [itemName],
					mainItemId: assembly.Id,
					item: assembly
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/getparametersforestitem', creationData).then(function(response) {
					let dataName = creationData.itemName + 'Param';
					let destParams = response.data[dataName] ? response.data[dataName] : [];
					let estimateMainCommonCopyAssemblyTemplateRuleService = $injector.get('estimateMainCommonCopyAssemblyTemplateRuleService');
					return estimateMainCommonCopyAssemblyTemplateRuleService.assignParameterFromProjectEstimateRules(formulaParameters, creationData, itemService, destParams);
				});
			}

			function copyParametersAndRefresh(){
				copyParametersToAssemblies();
				if(isRefresh){
					itemService.gridRefresh();
				}
			}

			angular.extend(service, {
				init: init,
				copyParametersAndRefresh: copyParametersAndRefresh
			});

			return service;
		}
	]);

})();
