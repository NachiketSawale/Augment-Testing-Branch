/**
 * Created by rei on 13.04.2016
 */

/**
 *      Interceptor for handling SidebarFilter Excpetions
 *      If there occures an exception while executing a filter, we watch for excpetions,
 *      as soon as an exception occures we check for a valid filterrequest and if ok we reset the filtre.pending flag
 *      be calling sidebarserver.updateFilterResult() with an error condition
 */
angular.module('cloud.desktop').factory('cloudDesktopSidebarHttpInterceptor', cloudDesktopSidebarHttpInterceptor);
cloudDesktopSidebarHttpInterceptor.$inject = ['$q', 'globals', '$injector'];

function cloudDesktopSidebarHttpInterceptor($q, globals, $injector) {
	'use strict';

	var cloudDesktopSidebarService;

	/**
	 * This function handles error messages force by the backend server.
	 * The error will be forwarded as Platform message 'onHttpError' containing error data
	 * @param rejection
	 * @returns {Promise}
	 */
	function responseError(rejection) {
		if (!cloudDesktopSidebarService) {
			cloudDesktopSidebarService = $injector.get('cloudDesktopSidebarService');
		}

		// do only checking error in case of filter request is pending
		if (cloudDesktopSidebarService.filterInfo.isPending) {

			if (rejection.status !== 401) { // && rejection.status !== -1) {  // authentication error handle by autothentication library and canceled promise (-1)

				// suppress fire error event for i18n json files
				// check posted data for the filter parameter by check for existence of ExecutionHints
				if (rejection.config && rejection.config.method === 'POST' && rejection.config.data.hasOwnProperty('ExecutionHints')) {
					var filterevent = {requestFailed: true};
					cloudDesktopSidebarService.updateFilterResult(filterevent);
				}
			}
		}
		return $q.reject(rejection);
	}

	return {
		responseError: responseError
	};
}

/**
 * register $http interceptor
 */
angular.module('cloud.desktop').config(['$httpProvider', function ($httpProvider) {
	'use strict';
	var httpInterceptor = 'cloudDesktopSidebarHttpInterceptor';
	$httpProvider.interceptors.push(httpInterceptor);
	// console.log('Error Interceptor ' + httpInterceptor + ' registered.');
}

]);

