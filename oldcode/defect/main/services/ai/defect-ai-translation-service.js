/**
 * Created by gaz on 04/05/2018.
 */
/* global */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('defectAiTranslationService',
		[
			'$q',
			'platformUIBaseTranslationService',
			'defectAiEstimateLayout',

			function ($q,
				PlatformUIBaseTranslationService,
				defectAiEstimateLayout) {
				var service;
				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				service = new MyTranslationService(
					[defectAiEstimateLayout]
				);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);
})(angular);