(function (angular) {

	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterParamterValueDataProvider',
		['$q',
			'constructionSystemMasterParameterValueDataService',
			'constructionSystemMasterTestDataService',
			'$http',

			function ($q,
				constructionSystemMasterParameterValueDataService,
				constructionSystemMasterTestDataService,
				$http) {

				var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/parametervalue/lookuplist';

				function getHttpService(itemId) {
					return $http.get(httpRoute + '?id=' + itemId);
				}

				return {
					getList: function (options) {
						var itemId = options.filterItemId || constructionSystemMasterTestDataService.getSelected().Id,
							list = constructionSystemMasterParameterValueDataService.getList(),
							cacheList = constructionSystemMasterParameterValueDataService.getAllCaheData(itemId);

						if (Array.isArray(list) && list.length > 0 && list[0].CosParameterFk === itemId) {
							return $q.when(list.sort(function (value1, value2) {
								return value1.Sorting - value2.Sorting;
							}));
						}
						else if (cacheList && Array.isArray(cacheList.loadedItems) && cacheList.loadedItems.length > 0) {
							return $q.when(cacheList.loadedItems.sort(function (value1, value2) {
								return value1.Sorting - value2.Sorting;
							}));
						}
						else {
							return getHttpService(itemId).then(function (response) {
								return response.data;
							});
						}
					},
					getItemByKey: function (value) {
						var deferred = $q.defer();
						var list = constructionSystemMasterParameterValueDataService.getList();
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								deferred.resolve(list[i]);
								break;
							}
						}
						return deferred.promise;
					},
					getSearchList: function () {
						return $q.when([]);
					}
				};
			}
		]);

})(angular);