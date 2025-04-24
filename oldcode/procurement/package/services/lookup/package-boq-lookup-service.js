/**
 * Created by chi on 6/27/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageBoqLookupService', procurementPackageBoqLookupService);

	procurementPackageBoqLookupService.$inject = ['_', '$q', '$http', 'globals', 'estimateMainCommonLookupService', 'procurementPackageDataService', 'cloudCommonGridService'];

	function procurementPackageBoqLookupService(_, $q, $http, globals, estimateMainCommonLookupService, procurementPackageDataService, cloudCommonGridService) {
		var service = {};

		var lookupData = {
			packageBoqItems: []
		};

		service.setPackageBoqItems = setPackageBoqItems;
		service.getList = getList;
		service.getListAsync = getListAsync;
		service.getItemById = getItemById;
		service.getItemByIdAsync = getItemByIdAsync;
		service.getSearchList = getSearchList;
		service.loadData = loadData;
		service.clearData = clearData;

		return service;

		// ///////////////////////////
		function getList() {
			return lookupData.packageBoqItems || [];
		}

		function setPackageBoqItems(values) {
			lookupData.packageBoqItems = values;
		}

		function getListAsync(options, scope) {
			var packageId = scope && scope.entity ? scope.entity.PrcPackageFk : null;
			if (packageId === null) {
				return $q.when([]);
			}

			clearData();

			if (!lookupData.packageBoqListPromise) {
				lookupData.packageBoqListPromise = $http.get(globals.webApiBaseUrl + 'procurement/package/boq/getsearchlist?packageId=' + packageId);
			}
			return lookupData.packageBoqListPromise.then(function (response) {
				lookupData.packageBoqListPromise = null;
				lookupData.packageBoqItems = response.data;
				return lookupData.packageBoqItems;
			});
		}

		function getItemById(id) {
			return getById(id);
		}

		function getItemByIdAsync(id) {
			var pack = procurementPackageDataService.getSelected();
			if (!pack || angular.isUndefined(pack.Id)) {
				return $q.when([]);
			}

			if (!lookupData.packageBoqItemsPromise) {
				lookupData.packageBoqItemsPromise = getListAsync(null, {entity: {PrcPackageFk: pack.Id}});
			}

			return lookupData.packageBoqItemsPromise.then(function(){
				lookupData.packageBoqItemsPromise = null;
				return getById(id);
			});
		}

		function getById(id) {
			var item = {};
			var list = lookupData.packageBoqItems;
			if (list && list.length > 0) {
				var output = [];
				list = cloudCommonGridService.flatten(list, output, 'BoqItems');
				item = _.find(list, {Id: id});
			}

			return item && angular.isDefined(item.Id) ? item : null;
		}

		function getSearchList(value, displayMember, scope) {
			var packageId = scope && scope.entity ? scope.entity.PrcPackageFk : null;
			if (packageId === null) {
				return $q.when([]);
			}

			clearData();

			if (value) {
				var list = lookupData.packageBoqItems || [];
				if (list.length > 0) {
					var filterParams = {
						codeProp: 'SearchPattern',
						descriptionProp: null,
						isSpecificSearch: null,
						searchValue: value
					};
					var existItems = estimateMainCommonLookupService.getSearchData(filterParams, list, 'BoqItems', 'BoqItemFk', true);
					return $q.when(existItems);
				} else {
					if (!lookupData.searchBoqItemsPromise) {
						lookupData.searchBoqItemsPromise = $http.get(globals.webApiBaseUrl + 'procurement/package/boq/getsearchlist?packageId=' + packageId + '&filterValue' + value);
					}

					return lookupData.searchBoqItemsPromise.then(function (response) {
						lookupData.searchBoqItemsPromise = null;
						lookupData.packageBoqItems = response.data;
						return response.data;
					});
				}
			} else {
				return $q.when([]);
			}
		}

		function loadData(scope) {

			var packageId = scope && scope.entity ? scope.entity.PrcPackageFk : null;
			if (packageId === null) {
				return $q.when([]);
			}

			if (!lookupData.packageBoqListPromise) {
				lookupData.packageBoqListPromise = $http.get(globals.webApiBaseUrl + 'procurement/package/boq/getsearchlist?packageId=' + packageId);
			}

			return lookupData.packageBoqListPromise.then(function (response) {
				lookupData.packageBoqListPromise = null;
				lookupData.packageBoqItems = response.data;
				return lookupData.packageBoqItems;
			});
		}

		function clearData() {
			lookupData.packageBoqItems = [];
		}
	}
})(angular);