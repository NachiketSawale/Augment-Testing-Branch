// / <reference path="../config.js" />
// / <reference path="../lib/10_angular/angular.js" />
/* global globals */
(function (angular) {
	'use strict';

	angular.module('platform').factory('initApp', initApp);

	initApp.$inject = ['_', '$injector', '$q', '$rootScope', '$location', 'tokenAuthentication', 'platformContextService', 'platformModalService', '$state'];

	function initApp(_, $injector, $q, $rootScope, $location, tokenAuthentication, platformContextService, platformModalService, $state)// jshint ignore:line
	{
		var appStartupToken = 'cloud.desktop.AppStartupInfo';

		/**
		 *
		 * @param url
		 * @param navigationParams
		 */
		function saveStartupInfo(url, navigationParams) { // jshint ignore:line
			platformContextService.setApplicationValue(appStartupToken, {url: url, navInfo: navigationParams});
		}

		/**
		 * remove the entry from app context
		 */
		function clearStartupInfo() { // jshint ignore:line
			platformContextService.removeApplicationValue(appStartupToken, null);
		}

		/**
		 *
		 * @returns {*}
		 */
		function getStartupInfo() { // jshint ignore:line
			return platformContextService.getApplicationValue(appStartupToken);
		}

		function navigateWithParameter(navInfo) {
			var promise = platformContextService.isSecureClientRoleReady;
			// var scctx = platformContextService.isSecureClientRolePresent;
			// console.log('navigateWithParameter: Promise=', promise, 'ctx:',scctx);
			promise.then(() => {
				// promise = platformContextService.isSecureClientRoleReady;
				const scctx = platformContextService.isSecureClientRolePresent;
				// console.log('navigateWithParameter: resolved => Promise=', promise, 'ctx:',scctx);
				if (!scctx) {
					console.error('navigateWithParameter may fail because SecureClientRole is missing ');
				}

				if (navInfo && navInfo.module) { // now redirect to request module
					const sidebarService = $injector.get('cloudDesktopSidebarService');
					if (navInfo.id) {
						sidebarService.setStartupFilter({filter: [navInfo.id], furtherFilter: [{Token: 'navInfo', Value: navInfo.id}]});
					}
					if (navInfo.search) {
						sidebarService.setStartupFilter({filter: navInfo.search, furtherFilter: [{Token: 'navInfo', Value: navInfo.search}]});
					}
					// console.log('navigateWithParameter: navigate to ',navInfo.module);
					$state.transitionTo(globals.defaultState + '.' + navInfo.module.replace('.', ''));
					return true;
				} else {
					return false;
				}
			});
		}

		/**
		 * this function checks if the navigation parameter are valid
		 *
		 */
		function validateNavigateInfo(navInfo) {
			var valid = true; // default
			if (navInfo) {
				if (navInfo.operation === 'inquiry') { // in case of inquiry company is mandatory
					valid = false;
					valid = (_.isString(navInfo.company) && navInfo.company.length > 0);
				}
				if (navInfo.operation === 'lookup') { // in case of lookup company is mandatory
					valid = false;
					valid = (_.isString(navInfo.company) && navInfo.company.length > 0);
				}
			}
			return valid;
		}

		/**
		 * This function is called each time a reload of the application takes place.
		 *
		 * We save origin url and do user company checking. If the last company/role saved to the current logged in user
		 * remains valid we navigate to the origin url >> jump company dialog
		 * if company/role no longer valid we navigate to company selection dialog.
		 */
		var init = function () {
			var initLocationUrl = $location.absUrl();
			console.log('initApp: startUrl ', initLocationUrl);
			if ($location.search().embedded) {
				globals.isEmbedded = true;
			}
			platformContextService.initialize();
			clearStartupInfo();
		};

		/**
		 * @type {url: url, navInfo: navigationParams}
		 */
		init.getStartupInfo = getStartupInfo;

		/*
		 */
		init.clearStartupInfo = clearStartupInfo;

		/*
		 */
		init.saveStartupInfo = saveStartupInfo;

		/*
		 */
		init.navigateWithParameter = navigateWithParameter;

		/*
		 */
		init.validateNavigateInfo = validateNavigateInfo;

		return init;
	}

})(angular);
