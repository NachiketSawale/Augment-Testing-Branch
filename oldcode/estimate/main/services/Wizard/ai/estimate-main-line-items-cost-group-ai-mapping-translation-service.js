/**
 * @author: chd
 * @date: 10/21/2020 2:37 PM
 * @description:
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemsCostGroupAiMappingTranslationService',
		['platformUIBaseTranslationService', '$q', 'estimateMainLineItemsCostGroupAiMappingLayout',

			function (PlatformUIBaseTranslationService, $q, estimateMainLineItemsCostGroupAiMappingLayout) {

				let service = {};// for some reason cannot be removed.

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				service = new MyTranslationService(
					[estimateMainLineItemsCostGroupAiMappingLayout]
				);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);
