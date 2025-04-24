(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('basics.pricecondition').factory('basicsPriceConditionTranslationService',
		['platformUIBaseTranslationService', 'basicsPriceConditionLayout', 'basicsPriceConditionDetailLayout', 'basicsPriceConditionParamLayout',
			function (PlatformUIBaseTranslationService, basicsPriceConditionLayout, basicsPriceConditionDetailLayout, basicsPriceConditionParamLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				return new MyTranslationService(
					[basicsPriceConditionLayout, basicsPriceConditionDetailLayout, basicsPriceConditionParamLayout]
				);
			}

		]);

})(angular);