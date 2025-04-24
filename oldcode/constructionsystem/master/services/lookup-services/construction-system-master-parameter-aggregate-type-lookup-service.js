/* global _ */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').factory('cosParameterAggregateTypeLookupService',
		['$q','basicsLookupdataLookupDescriptorService','aggregateTypeService',
			function ($q,lookupDescriptorService,aggregateTypeService) {
				var service = {};

				service.getList = function () {
					var list = aggregateTypeService.getList();
					if(list.length>0)
					{
						return $q.when(list);
					}
				};

				service.getItemById = function getItemById(id) {
					return _.find(aggregateTypeService.getList(), function (item) {
						return item.Id === id;
					});
				};

				service.getItemByKey = function getItemByKey(key) {
					var item;
					var deferred = $q.defer();


					var list = aggregateTypeService.getList();

					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}

					if (!item) {
						var targetData = lookupDescriptorService.getData('constructionSystemMasterAggregateType');
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