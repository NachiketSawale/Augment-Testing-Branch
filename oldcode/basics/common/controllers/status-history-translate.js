/* global angular */
(function (angular) {
	'use strict';
	var moduleName='basics.common';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName)
		.factory('basicsCommonStatusHistoryTranslationService', ['platformUIBaseTranslationService','$q', 'basicsCommonStatusHistoryLayout','basicsMaterialPriceConditionLayout','procurementCommonTranslationService',
			function (PlatformUIBaseTranslationService, $q,statusHistoryLayout,basicsMaterialPriceConditionLayout, procurementCommonTranslationService) {
				var service;
				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				service = new MyTranslationService([statusHistoryLayout,  basicsMaterialPriceConditionLayout,
					procurementCommonTranslationService.getCallOffAgreementLayout(), procurementCommonTranslationService.getMandatoryDeadlineLayout() ]);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);