/**
 * Created by lnt on 4/30/2019.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleParameterCodeLookupService
	 * @function
	 * @description
	 * estimateRuleParameterCodeLookupService is the data service for param code.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateRuleParameterCodeLookupService',
		['platformLookupDataServiceFactory','$http','$q','$injector', 'basicsLookupdataLookupDescriptorService',
			function (platformLookupDataServiceFactory, $http, $q, $injector, basicsLookupdataLookupDescriptorService) {
				let service = {};
				let lookupData = {};

				service.getList = function(){
					let cacheData = basicsLookupdataLookupDescriptorService.getData('parameterCode');
					if(!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {
						if(cacheData && _.size(cacheData)>0){
							let cacheObject={};
							cacheObject.data =cacheData;
							lookupData.paramValueAsyncPromise = $q.when(cacheObject);
						}else{
							lookupData.paramValueAsyncPromise = service.getEstMainParameters();
						}
					}
					return lookupData.paramValueAsyncPromise.then(function (response) {
						lookupData.paramValueAsyncPromise = null;
						basicsLookupdataLookupDescriptorService.updateData('parameterCode',response.data);
						return response;
					});
				};

				service.getEstMainParameters = function getEstMainParameters(){
					return $http.get(globals.webApiBaseUrl + 'estimate/rule/parameter/getparamsbylineitemcontext');
				};

				service.getListByPrj = function(){
					let cacheData = basicsLookupdataLookupDescriptorService.getData('prjparameterCode');
					if(!lookupData.prjParamValueAsyncPromise || lookupData.prjParamValueAsyncPromise === null) {
						if(cacheData && _.size(cacheData)>0){
							let cacheObject={};
							cacheObject.data =cacheData;
							lookupData.prjParamValueAsyncPromise = $q.when(cacheObject);
						}else{
							lookupData.prjParamValueAsyncPromise = service.getPrjEstMainParameters();
						}
					}
					return lookupData.prjParamValueAsyncPromise.then(function (response) {
						lookupData.prjParamValueAsyncPromise = null;
						basicsLookupdataLookupDescriptorService.updateData('prjparameterCode',response.data);
						return response;
					});
				};

				service.getPrjEstMainParameters = function getPrjEstMainParameters(){
					let projectSelected = $injector.get('projectMainService').getSelected();
					let projectId = projectSelected ? projectSelected.Id : 0;
					return $http.get(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/getparamsbylineitemcontextandprj?projectId=' + projectId);
				};


				return service;


			}]);
})(angular);
