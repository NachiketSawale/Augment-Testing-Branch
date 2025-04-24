(function (angular) {
	'use strict';

	angular.module('basics.material').factory('basicsMaterialTranslationService',
		['platformUIBaseTranslationService','$q','basicsMaterialRecordLayout',
			'basicsMaterialDocumentLayout', 'basicsMaterialCharacteristicLayout', 'basicsMaterialPriceConditionLayout',
			'basicsMaterialPriceListLayout','basicsMaterialStockLayout','basicsMaterial2CertificateLayout', 'basicsMaterialScopeTranslationInfoService',
			'basicsMaterial2basUomLayout','materialReferenceLayout','basicsMaterialPriceVersionToStockListLayout','basicsMaterialStockTotalLayout',
			'basicsMaterialPortionLayout',
			function (PlatformUIBaseTranslationService, $q,materialRecordLayout,
				documentLayout, characteristicLayout, priceConditionLayout,
				basicsMaterialPriceListLayout,basicsMaterialStockLayout,
				basicsMaterial2CertificateLayout, basicsMaterialScopeTranslationInfoService,basicsMaterial2basUomLayout,materialReferenceLayout,
				basicsMaterialPriceVersionToStockListLayout,basicsMaterialStockTotalLayout,
				basicsMaterialPortionLayout
			) {

				var service = {};

				function TranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				TranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				TranslationService.prototype.constructor = TranslationService;

				service = new TranslationService(
					[
						materialRecordLayout,
						documentLayout,
						characteristicLayout,
						priceConditionLayout,
						basicsMaterialPriceListLayout,
						basicsMaterialStockLayout,
						basicsMaterial2CertificateLayout,
						basicsMaterialScopeTranslationInfoService,
						basicsMaterial2basUomLayout,
						materialReferenceLayout,
						basicsMaterialPriceVersionToStockListLayout,
						basicsMaterialStockTotalLayout,
						basicsMaterialPortionLayout
					]
				);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);
