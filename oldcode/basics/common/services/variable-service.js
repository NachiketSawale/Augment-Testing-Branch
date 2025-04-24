/**
 * Created by chi on 10.23.2020.
 */
(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	/**
	 * use to handle inserting text in the text area.
	 */
	angular.module(moduleName).factory('basicsCommonVariableService', basicsCommonVariableService);

	basicsCommonVariableService.$inject = ['_', '$q', '$http', '$translate', 'globals', 'platformContextService'];

	function basicsCommonVariableService(_, $q, $http, $translate, globals, platformContextService) {

		const cache = {};
		const loginLanguageId = platformContextService.getDataLanguageId();

		return {
			getHandler: getHandler // use for customize
		};

		// ////////////////////////

		function getAsyncListByLanguageId(languageId) {
			return $http.get(globals.webApiBaseUrl + 'basics/textmodules/text/getvariablelist?languageId=' + languageId).then(function (response) {
				const list = response && angular.isArray(response.data) ? response.data : [];
				cache[languageId] = list;
				return list;
			}, function () {
				return []; // TODO chi: right?
			});
		}

		function getHandler(options) {
			options = options || {};
			return {
				getByLanguageId: function getByLanguageId(languageId) {
					languageId = languageId || null;
					if (!languageId && angular.isFunction(options.getLanguage)) {
						languageId = options.getLanguage();

						if (!languageId) {
							return $q.when([]);
						}
					}

					languageId = languageId || loginLanguageId;

					if (!languageId) {
						return $q.when([]);
					}

					if (cache[languageId]) {
						return $q.when(cache[languageId]);
					}

					if (angular.isFunction(options.beforeGetting)) {
						options.beforeGetting();
					}

					const defer = $q.defer();
					getAsyncListByLanguageId(languageId).then(function (list) {
						if (angular.isFunction(options.afterGetting)) {
							options.afterGetting();
						}
						defer.resolve(list);
					}, function () {
						if (angular.isFunction(options.afterGetting)) {
							options.afterGetting();
						}
						defer.resolve([]);
					});
					return defer.promise;

				}
			};
		}
	}
})(angular);