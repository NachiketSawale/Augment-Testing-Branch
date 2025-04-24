/**
 * Created by zos on 3/14/2018.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainParameterValueLookupService',
		['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformLookupDataServiceFactory', 'estimateMainDetailsParamListDataService',
			'cloudCommonGridService', 'boqMainService', 'boqRuleComplexLookupService', 'boqMainDetailsParamListDataService', 'boqParamDataService',
			function ($http, $q, $injector, basicsLookupdataLookupDescriptorService, platformLookupDataServiceFactory, estimateMainDetailsParamListDataService,
				cloudCommonGridService, boqMainService, boqRuleComplexLookupService, boqMainDetailsParamListDataService, boqParamDataService) {

				var service = {};
				var lookupData = {
					EstMainParameterValues: []
				};
				service.getList = function getList() {
					var result = lookupData.EstMainParameterValues && lookupData.EstMainParameterValues.length ? lookupData.EstMainParameterValues : [];
					return (angular.copy(result));
				};

				service.getItemById = function getItemById(value) {
					var items = {};
					var list = lookupData.EstMainParameterValues;
					if (list && list.length > 0) {
						var output = [];
						list = cloudCommonGridService.flatten(list, output, 'EstMainParameterValues');
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								items = list[i];
								break;
							}
						}
					}

					return items && items.Id ? items : null;
				};

				service.getItemByKey = function getItemByKey(key) {
					var item;
					var deferred = $q.defer();

					var list = service.getList();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						var targetData = basicsLookupdataLookupDescriptorService.getData('EstMainParameterValues');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[key];
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				};

				var getParamValues = function getParamValues(boqParamEntity) {
					var projectId = null;
					if (boqRuleComplexLookupService.isNavFromBoqProject) {
						projectId = boqMainService.getSelectedProjectId();
					}

					/* get the parameters of current boqItem */
					var dataList = boqMainDetailsParamListDataService.getList();
					var findLocationEntity;
					var codes = [];

					var boqParamInCache = $injector.get('boqParameterFormatterService').getBoqParamItems();
					var bqCodes = _.map(boqParamInCache, 'Code');
					codes = codes.concat(bqCodes);

					if (!boqParamEntity) {
						bqCodes = _.map(dataList, 'Code');
						codes = codes.concat(bqCodes);
					} else {

						if (dataList && dataList.length > 0 && boqParamEntity && boqParamEntity.Id) {
							findLocationEntity = _.find(dataList, function (item) {
								return item.Id && item.Id === boqParamEntity.Id;
							});
						}
						if (!findLocationEntity) {
							// data maybe from boqParamDataService
							dataList = boqParamDataService.getList();
							// dataList = boqParamDataService.getList();
							if (dataList && dataList.length > 0 && boqParamEntity && boqParamEntity.Id) {
								findLocationEntity = _.find(dataList, function (item) {
									return item.Id && item.Id === boqParamEntity.Id;
								});
							}
						}
					}

					if (findLocationEntity) {
						codes.push(findLocationEntity.Code);
					}

					var requestData = {
						codes: codes,
						PrjProjectFk: projectId
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/GetParamValueListByContextAndCodes', requestData);
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {
						lookupData.paramValueAsyncPromise = getParamValues();
					}
					return lookupData.paramValueAsyncPromise.then(function (response) {
						lookupData.paramValueAsyncPromise = null;
						lookupData.EstMainParameterValues = angular.copy(_.uniq(response.data, 'Id'));
						return service.getItemById(value);
					});
				};

				service.getSearchList = function () {
					return service.getList();
				};

				service.getListAsync = function getListAsync(config, scope) {
					if (!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {
						lookupData.paramValueAsyncPromise = getParamValues(scope.entity);
					}
					return lookupData.paramValueAsyncPromise.then(function (response) {
						lookupData.paramValueAsyncPromise = null;
						lookupData.EstMainParameterValues = angular.copy(_.uniq(response.data, 'Id'));

						if (scope && scope.entity) {
							var data = _.filter(lookupData.EstMainParameterValues, function (item) {
								if (scope.entity.Code === item.Code && scope.entity.ValueType === item.ValueType) {
									return true;
								}
							});
							data = _.sortBy(data, 'Sorting');
							return data;
						} else {
							return [];
						}
						// var selectItem = boqMainService.getSelected();//repalce with boqMainDetailsParamListDataService

						/* var data = _.filter(lookupData.EstMainParameterValues, function (item) {
							 if(selectItem.Code===item.Code){
								  return true;
							 }
						});
						return data; */
					});

				};

				// force to reload
				service.forceReload = function () {
					return getParamValues();
				};

				service.setLookupData = function (data) {
					lookupData.EstMainParameterValues = data;
				};

				service.clear = function () {
					lookupData.EstMainParameterValues = [];
				};
				return service;
			}]);
})(angular);
