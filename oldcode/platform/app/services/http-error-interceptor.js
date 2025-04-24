(function (angular) {
	'use strict';

	angular.module('platform').factory('platformErrorHttpInterceptor', errorHttpInterceptor);

	errorHttpInterceptor.$inject = ['$q', 'globals', '$injector'];

	function errorHttpInterceptor($q, globals, $injector) {
		var service = {};

		/**
		 * This function handles error messages force by the backend server.
		 * The error will be forwarded as Platform message 'onHttpError' containing error data
		 * @param rejection
		 * @returns {Promise}
		 */
		function responseError(rejection) {
			if (rejection.status !== 401 && rejection.status !== -1) {  // authentication error handle by autothentication library and canceled promise (-1)

				// suppress fire error event for i18n json files
				if (rejection && rejection.config && rejection.config.url) {
					switch (rejection.status) {
						case 502: // Bad Gateway
						case 503: // Service Unavailable
						case 504: // Gateway Timeout
							rejection.data = inj => {
								const $translate = inj.get('$translate');

								function translateWithFallback(key, fallback) {
									const result = $translate.instant(key);
									if (result === key) {
										return fallback;
									}

									return result;
								}

								const messageKey = 'platform.backendUnreachable';
								const message = translateWithFallback(messageKey, 'The server is unable to complete the request at this time.');

								const remedyKey = 'platform.backendUnreachableRemedy';
								const remedy = translateWithFallback(remedyKey, 'Please try again later.');

								return {
									ErrorMessage: `${message}\n\n${remedy}`,
									MessageDetail: `HTTP ${rejection.status} / ${rejection.statusText || '-'}`,
									ErrorDetail: `URL: ${rejection.config.url}`
								};
							};
							service.onHttpError.fire('platform.$http.error', rejection);
							break;
						default:
							if (rejection.config.url.indexOf('/i18n/') === -1) {
								if (rejection.config.headers.errorDialog === undefined || rejection.config.headers.errorDialog === true) {
									if (rejection.status === 409) {
										var concurrencyExceptionHandler = $injector.get('platformConcurrencyExceptionHandler');

										return concurrencyExceptionHandler.handleException(rejection).then(function () {
											return $q.reject(rejection);
										});
									} else {
										service.onHttpError.fire('platform.$http.error', rejection);
									}
								}
							} else if (rejection.status === 404) {
								var match = rejection.config.url.match(/(.+i18n\/.{2,3})-.{2,3}\.json$/);

								if (match) {
									rejection.config.url = match[1] + '.json';

									return $injector.get('$http')(rejection.config);
								} else {
									return $injector.get('$http').get(globals.appBaseUrl + 'app/content/i18n/empty.json');
								}
							}
							break;
					}
				}
			}

			return $q.reject(rejection);
		}

		service.onHttpError = new Platform.Messenger(); // jshint ignore:line
		service.responseError = responseError;

		return service;
	}

	/**
	 * register $http interceptor
	 */
	angular.module('platform').config(['$httpProvider',
		function ($httpProvider) {
			var httpInterceptor = 'platformErrorHttpInterceptor';

			$httpProvider.interceptors.push(httpInterceptor);
		}
	]);
})(angular);

