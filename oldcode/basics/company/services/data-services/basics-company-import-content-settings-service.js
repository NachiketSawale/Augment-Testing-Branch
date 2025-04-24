/**
 * Created by ysl on 12/13/2017.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImportContentSettingsService
	 * @function
	 *
	 * @description
	 * basicsCompanyImportContentSettingsService is the data service for all import content settings celection result data.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCompanyImportContentSettingsService', ['$http', 'globals',

		function ($http, globals) {
			var service = {};
			service.saveSettings = function (settings) {
				return $http.post(globals.webApiBaseUrl + 'basics/company/importcontent/savecontentsettings', settings);
			};

			service.getSettings = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/contentsettings');
			};

			return service;
		}]);
})(angular);
