(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectEstimateRuleParameterValueLookupService',
		['$http', '$q', 'estimateProjectEstRuleParameterValueService', 'basicsLookupdataLookupDescriptorService',
			function ($http, $q, estimateProjectEstRuleParameterValueService, basicsLookupdataLookupDescriptorService) {
				var service = {};
				service.getList = function getList(entity) {

					var list = [];

					var matchList = _.orderBy(estimateProjectEstRuleParameterValueService.getList(), ['Sorting'], ['asc']);
					if (!matchList.length) {
						list = basicsLookupdataLookupDescriptorService.getData('PrjRuleParameterValueLookup');

					} else {
						list = _.filter(matchList, function (pitem) {
							return pitem.Code === entity.Code;
						});

						if (!list.length) {
							list = basicsLookupdataLookupDescriptorService.getData('PrjRuleParameterValueLookup');
						}
					}
					if (_.size(list) > 0) {
						list = _.filter(list, function (pitem) {
							return pitem.Code === entity.Code;
						});
					}
					return $q.when(list);
				};

				service.getItemById = function getItemById(id) {
					var item;
					var list = estimateProjectEstRuleParameterValueService.getList();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === id) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						var targetData = basicsLookupdataLookupDescriptorService.getData('PrjRuleParameterValueLookup');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[id];
						}
					}
					return item;
				};

				service.getItemByKey = function getItemByKey(key) {
					var item;
					var deferred = $q.defer();

					var list = estimateProjectEstRuleParameterValueService.getList();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					if (!item) {
						var targetData = basicsLookupdataLookupDescriptorService.getData('PrjRuleParameterValueLookup');
						if (angular.isObject(targetData) || (Array.isArray(targetData) && targetData.length > 0)) {
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
