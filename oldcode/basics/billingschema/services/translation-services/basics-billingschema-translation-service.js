/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.billingschema';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('basicsBillingschemaTranslationService', ['$q','platformUIBaseTranslationService', 'basicsBillingSchemaConfigurationValuesService',
		function ($q,platformUIBaseTranslationService, basicsBillingSchemaConfigurationValuesService) {

			var layouts = basicsBillingSchemaConfigurationValuesService.getLayouts();
			var localBuffer = {};

			function TranslationService(layout) {
				platformUIBaseTranslationService.call(this, layout,localBuffer);
			}
			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;

			var service = new TranslationService(layouts);
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};
			return service;
			//platformUIBaseTranslationService.call(this, layouts, localBuffer);
		}
	]);
})(angular);
