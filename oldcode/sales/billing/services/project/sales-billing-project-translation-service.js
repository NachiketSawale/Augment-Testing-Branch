/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingProjectTranslationService', ['_', 'salesBillingTranslations',

		function (_, salesBillingTranslations) {

			var service = {},
				translations = salesBillingTranslations.translationInfos.extraWords;

			service.addSalesBillingTranslationsForProject = function (words) {
				_.each(translations, function (item, key) {
					if (!words[key]) {
						words[key] = translations[key];
					}
				});
			};

			return service;
		}]);
})();
