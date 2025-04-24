/**
 * Created by pel on 7/3/2019.
 */

(function (angular) {
	'use strict';
	var modName = 'procurement.inventory';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('procurementInventoryHeaderTranslationService', ['platformUIBaseTranslationService', '$q',
		'procurementInventoryHeaderLayout',
		function (PlatformUIBaseTranslationService, $q, procurementInventoryHeaderLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					procurementInventoryHeaderLayout
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
