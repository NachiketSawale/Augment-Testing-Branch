/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('platform');

	myModule.factory('platformWindowOpenerService', platformWindowOpenerService);

	platformWindowOpenerService.$inject = ['$window', '_'];

	function platformWindowOpenerService($window, _) {

		const windowNotifierName = 'rib$windowOpened';

		return {
			openWindow(url) {
				const newWindow = $window.open(url);

				// note that here, we intentionally reference the global window object as a common point of
				// access that can also be found by Cypress tests.
				if (_.isFunction(window[windowNotifierName])) {
					window[windowNotifierName]({
						url: url,
						window: newWindow
					});
				}

				return newWindow;
			}
		};
	}
})(angular);
