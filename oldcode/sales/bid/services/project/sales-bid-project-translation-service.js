/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidProjectTranslationService', ['_', 'salesBidTranslations',

		function (_, salesBidTranslations) {

			var service = {},
				translations = salesBidTranslations.translationInfos.extraWords;

			service.addSalesBidTranslationsForProject = function (words) {
				_.each(translations, function (item, key) {
					if (!words[key]) {
						words[key] = translations[key];
					}
				});
			};

			return service;
		}]);
})();
