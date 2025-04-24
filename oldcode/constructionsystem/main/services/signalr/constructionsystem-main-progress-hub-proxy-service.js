/**
 * Created by wui on 6/28/2017.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // has too many parameters
	angular.module(moduleName).factory('constructionSystemMainProgressHubProxyService', [
		'$rootScope',
		'signalRHubProxy',
		'signalRSubscribe',
		function ($rootScope,
			signalRHubProxy,
			subscribePrefix) {
			var hubName = 'cosProgressHub';

			function create() {
				return signalRHubProxy(globals.webApiBaseUrl, hubName);
			}

			function watch(proxy, event, callback) {
				proxy.on(event);
				$rootScope.$on(subscribePrefix + event, callback);

				return function () {
					proxy.off(event);
				};
			}

			function destroy(proxy) {
				proxy.stop();
			}

			return {
				create: create,
				watch: watch,
				destroy: destroy
			};
		}
	]);

})(angular, globals);