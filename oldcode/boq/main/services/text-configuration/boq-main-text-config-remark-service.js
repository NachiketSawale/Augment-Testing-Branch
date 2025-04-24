/**
 * Created by wul on 10/19/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainTextConfigRemarkService',
		['$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'platformLookupDataServiceFactory', 'projectStructuresSortCodeLookupService',
			function ($q, $injector, basicsLookupdataLookupDescriptorService, platformLookupDataServiceFactory, projectStructuresSortCodeLookupService) {
				var service = {};
				var items = [];

				service.getList = function getList(param) {
					items = service.loadLookupData(param);
					return $q.when(items);
				};

				service.getItemById = function getItemById(Code, param) {
					items = service.loadLookupData(param);
					var item = _.find(items, function (item) {
						return item[param.valueMember] === Code;
					});

					if (item) {
						return item;
					}

					return {Id: 0, Code: Code, Description: Code};
				};

				service.getItemByKey = function getItemByKey(Code, param) {
					var item;
					var deferred = $q.defer();
					items = service.loadLookupData(param);
					item = _.find(items, function (item) {
						return item[param.valueMember] === Code;
					});

					if (!item) {
						item = {Id: 0, Code: Code, Description: Code};
					}

					deferred.resolve(item);
					return deferred.promise;
				};
				service.getItemByIdAsync = function getItemByIdAsync(value, param) {
					return service.getItemByKey(value, param);
				};

				service.getSearchList = function getSearchList(value, param) {
					var item = [];
					var deferred = $q.defer();
					items = service.loadLookupData(param);
					var list = _.find(items, function (item) {
						return item[param.valueMember] === value;
					});
					if (_.isArray(list)) {
						deferred.resolve(list);
					} else if (!_.isNil(list)) {
						item.push(list);
						deferred.resolve(item);
					} else {
						deferred.resolve(item);
					}

					return deferred.promise;
				};

				service.loadLookupData = function () {
					var list = projectStructuresSortCodeLookupService.getLookupItems();

					return list;
				};

				return service;
			}]);
})(angular);
