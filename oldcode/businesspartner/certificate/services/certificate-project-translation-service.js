/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	var certificateModule = angular.module(moduleName);

	certificateModule.factory('businesspartnerCertificateProjectTranslationService', ['_', 'businesspartnerCertificateTranslations',

		function (_, businesspartnerCertificateTranslations) {

			var service = {},
			translations = businesspartnerCertificateTranslations.translationInfos.extraWords;

			service.addCertificateTranslationsForProject = function (words) {
				_.each(translations, function (item, key) {
					if (!words[key]) {
						words[key] = translations[key];
					}
				});
			};

			return service;
		}]);
})();
