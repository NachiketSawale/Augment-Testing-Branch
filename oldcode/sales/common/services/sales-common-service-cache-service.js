(function () {
	'use strict';

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonServiceCache', [
		function () {
			var service = {}, serviceCache = {};

			service.registerService = function (constructor, name) {
				var service = function () {
					var argument = arguments[0];
					var modName = argument.getModule().name;

					var dataServiceCache = serviceCache[modName];
					if (!dataServiceCache) {
						dataServiceCache = {};
						serviceCache[modName] = dataServiceCache;
					}

					var virtualName = name;
					if (argument && argument.markName) {
						virtualName = argument.markName + '.' + name;
					}

					var dataService = dataServiceCache[virtualName];
					if (!dataService) {
						dataService = constructor.apply(this, arguments);
						dataServiceCache[virtualName] = dataService;
					}

					return dataService;
				};

				return {
					getService: service
				};
			};

			return service;
		}
	]);
})();