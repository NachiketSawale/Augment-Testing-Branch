/**
 * Created by wed on 5/18/2018.
 */


(function (angular) {

	'use strict';

	var moduleName = 'basics.billingschema';
	angular.module(moduleName).factory('basicsBillingSchemaTranslateServiceFactory', ['$q', 'platformUIBaseTranslationService', function ($q, platformUIBaseTranslationService) {

		var serviceCache = {};

		function MyTranslationService(layout) {
			platformUIBaseTranslationService.call(this, layout);
		}

		function getService(qualifier, layout) {

			if (serviceCache[qualifier]) {
				return serviceCache[qualifier];
			} else {

				MyTranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				var service = new MyTranslationService([layout]);

				// For container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};
				serviceCache[qualifier] = service;
				return service;
			}
		}

		return {
			getService: getService
		};

	}]);

})(angular);
