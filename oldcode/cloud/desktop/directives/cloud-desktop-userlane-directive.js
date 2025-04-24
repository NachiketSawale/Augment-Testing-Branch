/**
 * @ngdoc directive
 * @name cloud.desktop.directive:cloudDesktopUserlane
 * @restrict A
 * @priority default value
 * @description
 * Insert userlane javascript block to init this component.
 *
 * @example
 * <div data-cloud-desktop-userlane></div>;
 */
(function (angular) {
	/* global globals */
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopUserlane', ['_', '$injector',
		function (_, $injector) {
			return {
				restrict: 'A',
				link: function () {

					if (!_.isNil(globals.userlanePropertyId) && !_.isEmpty(globals.userlanePropertyId)) {

						// load Userlane
						(function (i, s, o, g, r, a, m) {
							i['UserlaneCommandObject'] = r;
							i[r] = i[r] || function () {
								(i[r].q = i[r].q || []).push(arguments);
							};
							a = s.createElement(o), m = s.getElementsByTagName(o)[0];
							a.async = 1;
							a.src = g;
							m.parentNode.insertBefore(a, m);
						})(window, document, 'script', 'https://cdn.userlane.com/userlane.js', 'Userlane');

						var platformUserInfo = $injector.get('platformUserInfoService');
						if (platformUserInfo) {
							var userInfo = platformUserInfo.getCurrentUserInfo();
							if (userInfo) {
								// identify your user
								Userlane('identify', userInfo.LogonName);
								// Userlane('tag', role);  might come later...
								Userlane('lang', userInfo.UiLanguage);
							}
						}
						// initialize Command
						Userlane('init', globals.userlanePropertyId);
					}
				}
			};
		}]
	);
})(angular);
