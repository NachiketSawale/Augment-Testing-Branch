/**
 * Created by chk on 12/24/2015.
 */
/* global _ */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').factory('cosParameterGroupLookupService',
		['$q','$http', 'constructionSystemMasterParameterGroupDataService','basicsLookupdataLookupDescriptorService',
			function ($q,$http, parameterGroupDataService,lookupDescriptorService) {
				var service = {};

				/* var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/parametergroup/list';

			function getHttpService(mainItemId) {
				return $http.get(httpRoute + '?mainItemId=' + mainItemId);
			} */
				service.getList = function () {

					var list = parameterGroupDataService.getList();
					if(list.length>0)
					{
						return $q.when(list);
					}
				/* else
				{
					//add attribute {doesRequireLoadAlways: true} in entityRole,so  omission blower code
					var deferred = $q.defer();
					getHttpService(parentService.getSelected().Id).then(function (response) {
						deferred.resolve(response.data);
					})
					return deferred.promise;

				} */
				};

				service.getItemById = function getItemById(id) {
					var itemList = parameterGroupDataService.getList();
					return _.find(itemList, function (item) {
						return item.Id === id;
					});
				};

				service.getItemByKey = function getItemByKey(key) {
					var item;
					var deferred = $q.defer();


					var list = parameterGroupDataService.getList();

					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}

					if (!item) {
						var targetData = lookupDescriptorService.getData('CosParameterGroupLookup');
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