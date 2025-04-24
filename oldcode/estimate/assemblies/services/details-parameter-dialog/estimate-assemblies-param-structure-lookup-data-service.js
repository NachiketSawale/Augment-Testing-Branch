/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesParamStructureLookupDataService
	 * @function
	 * @description
	 * this is the data service providing data for parameter assigned structure lookup
	 */
	angular.module('estimate.assemblies').service('estimateAssembliesParamStructureLookupDataService', ['$http', '$q', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'estimateAssembliesService',
		'globals', '_', '$translate',
		function ($http, $q, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, estimateAssembliesService, globals, _, $translate) {

			// Object presenting the service
			let service = {
				getList: getFilteredList,
				getListSync: getListSync,
				getListAsync: getListAsync,
				getItemById: getItemByVal,
				getItemByKey: getItemByVal,
				getItemByIdAsync: getItemByIdAsync,
				clear: clear
			};

			// lookup data
			let lookupData = {
					paramStructures: []
				},
				items = [
					{
						Id: 1002, Code: 'Assembly', DescriptionInfo: {
							Description: 'Assembly',
							Translated: $translate.instant('estimate.assemblies.assembly')
						}
					}
				];

			// get selected estimate header id
			function getEstHeaderId() {
				return estimateAssembliesService.getSelectedEstHeaderId();
			}

			// get parameter structure promise
			function getParamStructPromise() {
				return $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/getstructuresbyheader?estHeaderId=' + getEstHeaderId());
			}

			// get data list of the parameter structure items sync
			function getListSync() {
				let list = lookupData.paramStructures && lookupData.paramStructures.length ? lookupData.paramStructures : [];
				return (angular.copy(list));
			}

			// get list of the parameter structure items async
			function getListAsync() {
				let list = getListSync();
				if (list && list.length > 0) {
					return $q.when((angular.copy(list)));
				} else {
					if (!lookupData.paramstructAsyncPromise) {
						lookupData.paramstructAsyncPromise = getParamStructPromise();
					}
					return lookupData.paramstructAsyncPromise.then(function (response) {
						lookupData.paramstructAsyncPromise = null;
						lookupData.paramStructures = angular.copy(response.data);

						return lookupData.paramStructures;
					});
				}
			}

			// get parameter structure items filtered as per given structure id
			function getFilteredList(/* opt, scope */) {
				return $q.when(items);
			}

			// get parameter structure item by Id
			function getItemByVal(value) {
				if (value === 16) {
					return {
						Id: 16, Code: 'Assembly Category', DescriptionInfo: {
							Description: 'Assembly Category',
							Translated: $translate.instant('estimate.assemblies.estAssemblyCat')
						}
					};
				} else {
					return _.find(items, {Id: 1002});
				}
			}

			// get parameter structure item by Id Async
			function getItemByIdAsync(value) {
				if (!lookupData.paramstructAsyncPromise) {
					lookupData.paramstructAsyncPromise = getListAsync();
				}
				return lookupData.paramstructAsyncPromise.then(function () {
					lookupData.paramstructAsyncPromise = null;
					return getItemByVal(value);
				});
			}

			function clear() {
				lookupData.paramStructures = [];
			}

			return service;
		}]);
})(angular);
