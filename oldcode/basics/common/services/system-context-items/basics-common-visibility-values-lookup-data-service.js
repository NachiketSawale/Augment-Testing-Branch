(function (angular) {
	'use strict';
	angular.module('basics.common').factory('basicsCommonVisibilityValuesLookupDataService',
		['$q', 'platformTranslateService', '_',
			function ($q, platformTranslateService, _) {
				const service = {};
				const visibilityItems = [
					{Id: 1, description$tr$: 'basics.config.visibilityProperty.standardOnly'},
					{Id: 2, description$tr$: 'basics.config.visibilityProperty.portalOnly'},
					{Id: 3, description$tr$: 'basics.config.visibilityProperty.standardPortal'}
				];
				platformTranslateService.translateObject(visibilityItems, ['description']);
				service.getList = function () {
					const list = visibilityItems;

					if (list.length > 0) {
						return $q.when(list);
					}
				};

				service.getItemById = function getItemById(id) {
					return _.find(visibilityItems, function (item) {
						return item.Id === id;
					});
				};

				service.getItemByKey = function getItemByKey(key) {
					let item;
					const deferred = $q.defer();

					const list = visibilityItems;

					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}

					if (!item) {
						const targetData = visibilityItems;
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