/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipProjectTranslationService', ['_', 'salesWipTranslations',

		function (_, salesWipTranslations) {

			var service = {},
				translations = salesWipTranslations.translationInfos.extraWords;

			service.addSalesWipTranslationsForProject = function (words) {
				_.each(translations, function (item, key) {
					if (!words[key]) {
						words[key] = translations[key];
					}
				});
			};

			return service;
		}]);
})();
