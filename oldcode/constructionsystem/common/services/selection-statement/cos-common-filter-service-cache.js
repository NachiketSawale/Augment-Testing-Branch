/**
 * Created by lst on 8/16/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonFilterServiceCache',
		['$injector','platformPermissionService',

			function ($injector,platformPermissionService) {

				var service = {};

				service.serviceCache={};

				service.getService = function (serviceName,parentServiceName) {
					var serviceKey=serviceName+'$$'+parentServiceName;
					var dataServiceCache = service.serviceCache[serviceKey];
					if (!dataServiceCache) {
						dataServiceCache = $injector.get(serviceName).createService(parentServiceName);
						service.serviceCache[serviceKey] = dataServiceCache;
					}


					return dataServiceCache;
				};

				service.setFilterReadOnly = function (scope){
					var permissionUuid = scope.getContentValue('permission');
					var hasCreate = platformPermissionService.hasCreate(permissionUuid);
					var hasWrite =  platformPermissionService.hasWrite(permissionUuid);
					var hasDelete = platformPermissionService.hasDelete(permissionUuid);
					if (!hasWrite && !hasCreate && !hasDelete){
						scope.searchOptions.active = false;
					}
				};

				return service;
			}
		]);
})(angular);