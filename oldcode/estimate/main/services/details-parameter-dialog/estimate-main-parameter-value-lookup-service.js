/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainParameterValueLookupService',
		['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformLookupDataServiceFactory', 'estimateMainDetailsParamListDataService',
			'cloudCommonGridService', 'estimateMainService','estimateRuleParameterConstant',
			function ($http, $q, $injector, basicsLookupdataLookupDescriptorService, platformLookupDataServiceFactory, estimateMainDetailsParamListDataService,
				cloudCommonGridService, estimateMainService,estimateRuleParameterConstant) {

				let service = {};
				let lookupData = {
					EstMainParameterValues: []
				};

				service.getList = function getList() {
					let estMainParameterValues = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');
					let result = estMainParameterValues && _.size(estMainParameterValues)>0 ? estMainParameterValues : [];
					return (angular.copy(result));
				};

				service.getItemById = function getItemById(value) {
					let items = {};
					let list = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');
					if (list && _.size(list)  > 0) {
						items =_.find(list, function(item){return item.Id=== value;});
					}

					return items && items.Id ? items : null;
				};

				service.getItemByKey = function getItemByKey(key) {
					let item;
					let deferred = $q.defer();

					let list = service.getList();
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						let targetData = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && _.size(targetData)  > 0)) {
							item = targetData[key];
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {

					let estMainParameterValues = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');

					if(!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {
						if(estMainParameterValues && _.size(estMainParameterValues) >0){

							let item = service.getItemById(value);
							if(item){
								let deferred = $q.defer();
								deferred.resolve(estMainParameterValues);
								lookupData.paramValueAsyncPromise = deferred.promise;
							}else{
								lookupData.paramValueAsyncPromise = service.getParamValues();
							}
						}else{
							lookupData.paramValueAsyncPromise = service.getParamValues();
						}

					}
					return lookupData.paramValueAsyncPromise.then(function (response) {
						lookupData.paramValueAsyncPromise = null;
						let data= [];
						if(response.data){
							data = response.data;
						}else{
							data = response;
						}
						let result =  angular.copy(_.uniq(data, 'Id'));
						basicsLookupdataLookupDescriptorService.updateData('EstMainParameterValues',result);
						return service.getItemById(value);
					});

				};

				service.getSearchList = function () {
					return service.getList();
				};

				service.getListAsync = function getListAsync(currentItem) {

					let selectItem = currentItem;

					if(!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {

						lookupData.paramValueAsyncPromise = service.getParamValues();
					}

					return lookupData.paramValueAsyncPromise.then(function (response) {

						let data= [];
						if(response.data){
							data = response.data;
						}else{
							data = response;
						}

						_.forEach(data,function(item){
							if(item.ValueType === estimateRuleParameterConstant.TextFormula){
								item.Value = item.ValueDetail;
							}
						});

						let result =  angular.copy(_.uniq(data, 'Id'));
						basicsLookupdataLookupDescriptorService.updateData('EstMainParameterValues',result);

						let estMainParameterValues = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');

						data = _.filter(estMainParameterValues, function (item) {
							if(selectItem && selectItem.Code.toLowerCase()=== item.Code.toLowerCase() && selectItem.ValueType === item.ValueType){
								return item;
							}
						});

						data = _.sortBy(data,'Sorting');
						$injector.get('estimateParamComplexLookupCommonService').mergeCusParamValue(selectItem, data);
						return data;
					});
				};


				// the assembly module & estimate module & boq module :open the parameter window from the assembly/lineitem list,

				service.getParamValues = function getParamValues() {

					let projectId = null;// the wic boq ,assembly module no need get the projectId

					let dataList =[];
					let estimateParamDataService = $injector.get('estimateParamDataService');

					let estimateParamComplexLookupCommonService = $injector.get('estimateParamComplexLookupCommonService');

					let isParam = $injector.get('estimateParamDataService').getIsParam();
					let isPrjParam = false;

					// assembly module get the parameters from the  estimateAssembliesService
					let isAssembly = $injector.get('estimateAssembliesService').getIsAssembly();

					// estimate module get the paramters from the estimateParamDataService
					let isEstimate = estimateMainService.getIsEstimate();

					let isFromWicBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();

					let isFromProjectBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqProject();

					let fromModule = estimateParamDataService.getModule();
					if(fromModule && fromModule.toLowerCase()==='project')
					{
						projectId = estimateParamDataService.getProjectId();
						dataList = $injector.get('estimateParameterPrjParamService').getList();
						isPrjParam = true;

					}else if(fromModule && fromModule.toLowerCase()==='estlineitems'){
						projectId = isEstimate ? estimateMainService.getSelectedProjectId() : null;
					}


					if(isFromProjectBoq)
					{
						projectId = $injector.get('boqMainService').getSelectedProjectId();
						dataList = $injector.get('boqMainDetailsParamListDataService').getList();

					}
					if(isFromWicBoq)
					{
						projectId = null;
						dataList = $injector.get('boqMainDetailsParamListDataService').getList();

					}

					//prjAssembly
					if(estimateParamComplexLookupCommonService.getIsPrjAssemblyCat() || estimateParamComplexLookupCommonService.checkIsPrjAssembly()){
						let projectMainSelected = $injector.get('projectMainService').getSelected();
						projectId = projectMainSelected ? projectMainSelected.Id : null;
					}

					if (isAssembly)
					{
						// after assign rule show parameter dailog window
						dataList = $injector.get('estimateAssembliesDetailsParamListDataService').getList();
						projectId = null;  // no need search the parameter by projectId in assembly module

					}
					if (isEstimate && !(fromModule && fromModule.toLowerCase()==='project'))
					{
						dataList = estimateMainDetailsParamListDataService.getList();
						var paramContainerDataList = $injector.get('estimateMainLineitemParamertersService').getList();
						dataList  = dataList.concat(paramContainerDataList);
						projectId = estimateMainService.getSelectedProjectId();
					}
					if(isParam && !isPrjParam)
					{
						dataList = estimateParamDataService.getParams();
					}

					let codes = [];
					let valueTypes =[];
					if (dataList && dataList.length > 0) {
						_.each(dataList, function (item) {
							codes.push(item.Code);
							valueTypes.push(item.ValueType);
						});
					}

					setProjectId2ParameterValue(projectId);

					let requestData = {
						codes: codes,
						ValueTypes :valueTypes,
						PrjProjectFk: projectId,
					};
					lookupData.paramValueAsyncPromise = $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/GetParamValueListByContextAndCodes', requestData);
					return lookupData.paramValueAsyncPromise;
				};

				let projectId2ParameterValue;
				function setProjectId2ParameterValue(projectId){
					projectId2ParameterValue = projectId;
				}

				service.getProjectId2ParameterValue = function(){
					return projectId2ParameterValue;
				};

				// force to reload
				service.forceReload = function () {
					basicsLookupdataLookupDescriptorService.removeData('EstMainParameterValues');
					return service.getParamValues();
				};

				service.setLookupData = function (data) {
					basicsLookupdataLookupDescriptorService.updateData('EstMainParameterValues',data);
				};

				service.clear = function () {
					lookupData.paramValueAsyncPromise = null;
					basicsLookupdataLookupDescriptorService.removeData('EstMainParameterValues');
				};
				return service;
			}]);
})(angular);
