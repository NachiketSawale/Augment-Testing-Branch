/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformTranslateCustomLoader
	 * @function
	 * @requires $q, $translatePartialLoader
	 * @description
	 * platformTranslateCustomLoader provides a custom loader to load module + custom translations
	 */
	angular.module('platform').factory('platformTranslateCustomLoader', platformTranslateCustomLoader);

	platformTranslateCustomLoader.$inject = ['$translatePartialLoader'];

	function platformTranslateCustomLoader($translatePartialLoader) {
		var service = function (options) {
			options.urlTemplate = function urlTemplateProvider(part, lang) {
				var urlTemplate = globals.appBaseUrl + '{part}/content/i18n/{lang}.json' + globals.timestamp;
				var splitPart = part.split('.', 2);

				if (splitPart[0] === '$custom') {
					urlTemplate = globals.baseUrl + 'cdn/custom/i18n/' + splitPart[1] + '/{lang}.json' + globals.timestamp;
				} else if (part.startsWith('$cust')) {
					urlTemplate = globals.webApiBaseUrl + 'cloud/translation/custom/loadsection?section={part}&culture={lang}';
				} else if (splitPart[0] === '$userLabel') {
					urlTemplate = globals.webApiBaseUrl + 'basics/customize/userlabel/load?language={lang}';
				}

				return urlTemplate.replace(/\{part\}/g, part).replace(/\{lang\}/g, lang);
			};

			return $translatePartialLoader(options);
		};

		return service;
	}
})(angular);

