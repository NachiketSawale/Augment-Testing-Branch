/**
 * Created by reimer on 07.05.2018.
 */

(function () {

	'use strict';

	var moduleName = 'cloud.desktop';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('cloudDesktopUserfontService',
		['$q',
			'$http',
			function ($q, $http) {

				var data = null;      // cached object list
				var css = null;

				var service = {};

				service.loadData = function () {

					var deffered = $q.defer();

					if (data === null) {
						$http.get(globals.webApiBaseUrl + 'cloud/desktop/userfont/list').then(function (response) {
							data = response.data;
							deffered.resolve();
						});
					} else {
						deffered.resolve();
					}

					return deffered.promise;
				};

				service.getList = function () {
					return data;
				};

				service.loadCSS = function () {

					var deffered = $q.defer();

					if (css === null) {
						$http.get(globals.webApiBaseUrl + 'cloud/desktop/userfont/css').then(function (response) {
							css = response.data;
							deffered.resolve();
						});
					} else {
						deffered.resolve();
					}

					return deffered.promise;
				};

				service.getCSS = function () {
					return css;
				};

				return service;

			}
		]);
})(angular);
