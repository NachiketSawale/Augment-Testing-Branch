/*
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformStartupRouteService
	 * @function
	 * @description
	 * This service is used to save and load a start-up target URL in local storage in order to bridge
	 * reloads.
	 */
	angular.module('platform').factory('platformStartupRouteService', platformStartupRouteService);

	platformStartupRouteService.$inject = ['$state'];

	function platformStartupRouteService($state) {
		const storageKey = `${globals.appBaseUrl}-startup`;

		function clearStartupRoute() {
			localStorage.removeItem(storageKey);
		}

		return {
			clearStartupRoute,
			saveStartupRoute(targetState, targetParams) {
				const info = {
					target: targetState,
					targetParams
				};

				localStorage.setItem(storageKey, JSON.stringify(info));
			},
			navigateToStartupRoute() {
				function loadInfo() {
					try {
						const rawInfo = localStorage.getItem(storageKey);
						if (rawInfo) {
							return JSON.parse(rawInfo);
						}
					} finally {
						clearStartupRoute();
					}
					return null;
				}

				const info = loadInfo();
				if (info) {
					$state.transitionTo(info.target, info.targetParams);
					return true;
				}
				return false;
			}
		};
	}
})(angular);
