/* global  */
(function (angular) {
	'use strict';
	var moduleName='defect.main';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName)
		.factory('defectMainTranslationService', ['platformUIBaseTranslationService','$q', 'defectMainHeaderLayout','basicsMaterialPriceConditionLayout','procurementCommonTranslationService',
			function (PlatformUIBaseTranslationService, $q,defectMainHeaderLayout,basicsMaterialPriceConditionLayout, procurementCommonTranslationService) {
				var service;
				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				service = new MyTranslationService([defectMainHeaderLayout, basicsMaterialPriceConditionLayout,
					procurementCommonTranslationService.getCallOffAgreementLayout(), procurementCommonTranslationService.getMandatoryDeadlineLayout() ]);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);