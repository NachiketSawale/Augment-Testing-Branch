(function (angular) {
	'use strict';
	/* global _ */
	angular.module('constructionsystem.master').factory('cosParameterValueLookupService',
		['$q', '$http', 'constructionSystemMasterParameterValueDataService', 'basicsLookupdataLookupDescriptorService',
			function ($q, $http, parameterValueDataService, lookupDescriptorService) {
				var service = {};

				service.getList = function () {
					var list = parameterValueDataService.getList();
					return $q.when(list);
				};

				service.getItemById = function getItemById(id) {
					var itemList = parameterValueDataService.getList();
					return _.find(itemList, function (item) {
						return item.Id === id;
					});
				};

				service.getItemByKey = function getItemByKey(key) {
					/*
                     if (key === 0) {
                     return $q.when(key);
                     }
                     */

					var item;
					var deferred = $q.defer();


					var list = parameterValueDataService.getList();

					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}

					if (!item) {
						var targetData = lookupDescriptorService.getData('CosParameterValueLookup');
						if (angular.isObject(targetData)||(Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[key];
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					return service.getItemByKey(value);
				};

				service.getSearchList = function () {
					return service.getList();
				};
				return service;
			}]);
})(angular);