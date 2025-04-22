/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractProjectTranslationService', ['_', 'salesContractTranslations',

		function (_, salesContractTranslations) {

			var service = {},
				translations = salesContractTranslations.translationInfos.extraWords;

			service.addSalesContractTranslationsForProject = function (words) {
				_.each(translations, function (item, key) {
					if (!words[key]) {
						words[key] = translations[key];
					}
				});
			};

			return service;
		}]);
})();
