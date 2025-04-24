(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerObserverService', [function () {
		var service = {
			loaded: false // drawing loaded
		};

		service.request = function (func, action) {
			requestAnimationFrame(function () {
				if (func.$canceled) {
					return;
				}

				if (service.loaded) {
					var value = func.call();
					if (value !== func.$lastValue) {
						action(value, func.$lastValue);
						func.$lastValue = value;
					}
				}

				service.request(func, action);
			});
		};

		service.watch = function (func, action) {
			func.$canceled = false;
			service.request(func, action);
			return function () {
				func.$canceled = true;
			};
		};

		service.disable = function () {
			service.loaded = false;
		};

		service.enable = function () {
			service.loaded = true;
		};

		return service;
	}]);

})(angular);