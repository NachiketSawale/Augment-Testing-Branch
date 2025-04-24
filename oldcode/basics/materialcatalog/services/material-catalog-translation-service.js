/**
 * Created by wuj on 3/6/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsMaterialcatalogTranslationService', ['platformUIBaseTranslationService','$q',
		'basicsMaterialCatalogLayout', 'basicsMaterialGroupLayout', 'basicsMaterialGroupCharLayout', 'basicsMaterialDiscountGroupLayout', 'basicsMaterialGroupCharValLayout',
		'basicsMaterialCatalogPriceVersionLayout', 'basicsMaterialCatalogPriceVersionToCompanyLayout', 'basicsMaterialCatalogPriceVersionToCompanyLayoutNew','basicsMaterialCatalogPriceVersionToCustomerLayout', 'basicsMaterialCatalogToCompaniesLayoutService',

		function (PlatformUIBaseTranslationService,$q, materialCatalogLayout, materialGroupLayout, basicsMaterialGroupCharLayout, basicsMaterialDiscountGroupLayout, basicsMaterialGroupCharValLayout,
				  basicsMaterialCatalogPriceVersionLayout, basicsMaterialCatalogPriceVersionToCompanyLayout, basicsMaterialCatalogPriceVersionToCompanyLayoutNew,basicsMaterialCatalogPriceVersionToCustomerLayout, basicsMaterialCatalogToCompaniesLayout) {

			var service = {};

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			service = new MyTranslationService(
				[materialCatalogLayout, materialGroupLayout, basicsMaterialGroupCharLayout,
					basicsMaterialDiscountGroupLayout, basicsMaterialGroupCharValLayout,
					basicsMaterialCatalogPriceVersionLayout, basicsMaterialCatalogPriceVersionToCompanyLayout,
					basicsMaterialCatalogPriceVersionToCompanyLayoutNew,basicsMaterialCatalogPriceVersionToCustomerLayout,
					basicsMaterialCatalogToCompaniesLayout]
			);

			//for container information service use
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}

	]);

})(angular);