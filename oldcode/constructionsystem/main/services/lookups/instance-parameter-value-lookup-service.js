/**
 * Created by chi on 6/8/2016.
 */
(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterLookupService', ['$http', '$q', 'basicsLookupdataLookupDescriptorService',
		function ($http, $q, basicsLookupdataLookupDescriptorService) {
			var service = {};

			service.getSearchList = getSearchList;
			service.getList = getList;
			service.getItemByKey = getItemByKey;

			return service;

			// //////////////////////////////
			function getGetListByFilter(searchSettings) {
				var deferred = $q.defer();
				var filterValue;
				if (searchSettings.filterString.length > 0) {
					filterValue = searchSettings.filterString + ' and ' + searchSettings.customerFilter;
				} else {
					filterValue = searchSettings.customerFilter;
				}

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/instanceparametervaluelookup/getlist', {
					params: {
						filterValue: filterValue
					}
				}).then(function (response) {
					deferred.resolve(response.data);
				});

				return deferred.promise;
			}

			// noinspection JSUnusedLocalSymbols
			function getSearchList(searchString, displayMember, scope, getSearchListSettings) {
				return getGetListByFilter(getSearchListSettings);
			}

			// noinspection JSUnusedLocalSymbols
			function getList(options, scope, getSearchListSettings) {
				return getGetListByFilter(getSearchListSettings);
			}

			function getItemByKey(id) {
				var deferred = $q.defer();

				if (id >= 0) {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/main/instanceparametervaluelookup/getitembykey?id=' + id).then(function (response) {
						deferred.resolve(response.data);
					});
				} else {
					var parameterValues = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterValue');
					var parameterValue = parameterValues ? parameterValues[id] : null;
					deferred.resolve(parameterValue);
				}

				return deferred.promise;
			}
		}
	]);

})(angular);