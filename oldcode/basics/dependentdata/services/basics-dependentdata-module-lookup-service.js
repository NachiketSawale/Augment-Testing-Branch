/**
 * Created by reimer on 27.10.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @returns
	 */
	angular.module(moduleName).factory('basicsDependentDataModuleLookupService',

		['$http', '$q', function ($http, $q) {
			var service = {};
			var data;

			var _idOfDynamicLinkProxyModule = 31; // cloud.boq (sample) represents dynamic module link!

			service.getlookupType = function () {
				return 'basicsDependentDataModule';
			};

			service.loadData = function () {
				if (!data) {
					return $http.get(globals.webApiBaseUrl + 'cloud/common/module/lookup').then(function (response) {
						data = response.data;

						var dynamicLinkModule = service.getItemByKey(_idOfDynamicLinkProxyModule);
						if (!dynamicLinkModule) {
							dynamicLinkModule = {Id: _idOfDynamicLinkProxyModule, Description: {}};
						}
						dynamicLinkModule.Description.Description = ' [Dynamic]';

						return true;
					});
				}

				return $q.when(true);
			};

			service.getList = function (removeDynamicItem) {

				var list = data;
				if (data && removeDynamicItem) {
					list = _.filter(data, function (item) {
						return item.Id !== _idOfDynamicLinkProxyModule;
					});
				}
				return list;
			};

			service.getListSortByInternalName = function (removeDynamicItem) {
				return _.sortBy(service.getList(removeDynamicItem), function (o) {
					return o.InternalName;
				});
			};

			service.getListSortByDescription = function (removeDynamicItem) {
				return _.sortBy(service.getList(removeDynamicItem), function (o) {
					return o.Description.Description;
				});
			};

			service.getItemByKey = function (value) {

				var list = service.getList();
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						return list[i];
					}
				}
				return {};
			};

			service.getItemByInternalName = function (moduleInternalName) {

				var list = service.getList();
				for (var i = 0; i < list.length; i++) {
					if (list[i].InternalName === moduleInternalName) {
						return list[i];
					}
				}
				return null;
			};

			service.supportsAuditTrail = function (moduleInternalName) {

				var moduleData = service.getItemByInternalName(moduleInternalName);
				return moduleData !== null && moduleData.LogfileTablename !== null && moduleData.LogfileTablename !== '';
			};

			service.getAuditTrailArdFk = function (moduleInternalName) {

				var moduleData = service.getItemByInternalName(moduleInternalName);
				return moduleData === null ? null : moduleData.AuditTrailArdFk;
			};

			service.refresh = function () {
				data = null;

				return service.loadData();
			};

			service.isDynamicLinkModule = function (moduleId) {
				return moduleId === _idOfDynamicLinkProxyModule;
			};

			return service;
		}]);
})();

