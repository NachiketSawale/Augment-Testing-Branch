/**
 * Created by gaz on 04/05/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsMaterialCatalogAiTranslationService',
		[
			'$q',
			'platformUIBaseTranslationService',
			'basicsMaterialCatalogPriceVersionToCustomerLayout',
			'materialCatalogGroupAiMappingLayout',

			function ($q,
					  PlatformUIBaseTranslationService,
					  basicsMaterialCatalogPriceVersionToCustomerLayout,
					  materialCatalogGroupAiMappingLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				var service = new MyTranslationService(
					[basicsMaterialCatalogPriceVersionToCustomerLayout,materialCatalogGroupAiMappingLayout]
				);

				//for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);
})(angular);