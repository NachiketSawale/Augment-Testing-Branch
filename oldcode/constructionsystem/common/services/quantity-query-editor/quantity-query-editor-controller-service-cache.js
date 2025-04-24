/**
 * Created by jim on 10/9/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.common';

	angular.module(moduleName).factory('quantityQueryEditorControllerServiceCache',
		['$injector',

			function ($injector) {

				var service = {};

				service.serviceCache={};

				// service.getService = function (serviceName,parentServiceName) {
				// var serviceKey=serviceName+'$$'+parentServiceName;
				// var dataServiceCache = service.serviceCache[serviceKey];
				// if (!dataServiceCache) {
				//     dataServiceCache = $injector.get(serviceName).createService(parentServiceName);
				//     service.serviceCache[serviceKey] = dataServiceCache;
				// }
				//
				//
				// return dataServiceCache;
				// };

				service.getService = function (serviceName,parentServiceName) {
					var serviceKey=serviceName+'$$'+parentServiceName;
					var dataService = service.serviceCache[serviceKey];
					if (!dataService) {
						dataService = $injector.get(serviceName).createService();
						service.serviceCache[serviceKey] = dataService;
					}
					return dataService;
				};

				return service;
			}
		]);
})(angular);
