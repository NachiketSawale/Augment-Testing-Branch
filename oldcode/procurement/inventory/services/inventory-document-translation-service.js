/**
 * Created by pel on 7/9/2019.
 */

(function (angular) {
	'use strict';
	var modName = 'procurement.inventory';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('inventoryDocumentTranslationService', ['platformUIBaseTranslationService', '$q',
		'inventoryDocumentLayout',
		function (PlatformUIBaseTranslationService, $q, inventoryDocumentLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					inventoryDocumentLayout
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
