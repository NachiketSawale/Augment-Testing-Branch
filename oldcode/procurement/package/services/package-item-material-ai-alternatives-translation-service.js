/**
 * Created by gaz on 04/05/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageItemMaterialAiAlternativesTranslationService',
		[
			'$q',
			'platformUIBaseTranslationService',
			'procurementPackageItemMaterialAiAlternativesLayout',

			function ($q,
				PlatformUIBaseTranslationService,
				procurementPackageItemMaterialAiAlternativesLayout) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				var service = new MyTranslationService(
					[procurementPackageItemMaterialAiAlternativesLayout]
				);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);
})(angular);