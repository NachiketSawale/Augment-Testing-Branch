/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemsActivityAiMappingTranslationService',
		['platformUIBaseTranslationService', '$q', 'estimateMainLineItemsActivityAiMappingLayout',

			function (PlatformUIBaseTranslationService, $q, estimateMainLineItemsActivityAiMappingLayout) {

				let service = {};// for some reason cannot be removed.

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				service = new MyTranslationService(
					[estimateMainLineItemsActivityAiMappingLayout]
				);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);
