/**
 * @ngdoc directive
 * @name cloud.desktop.directive:cloudDesktopCustomLoginCss
 * @element style
 * @restrict A
 * @priority default value
 * @description
 * Insert users custom css for the login dialog, which is defined in the User-Settings-Dialog by the system.
 *
 * @example
 * <style data-cloud-desktop-custom-login-css></style>;
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopCustomLoginCss', ['platformLogonService',
		function (platformLogonService) {
			return {
				restrict: 'A',
				link: function (scope, elem) {

					let content = platformLogonService.getCustomLogonCss();
					elem.text(content);


					setTimeout(function() {
						let companyLoginLogo = document.getElementsByClassName('company-login-logo');
						let url = $('.company-login-logo').length > 0 ? $('.company-login-logo').css('background-image').slice(4, -1).replace(/"/g, '') : '';

						if(url && url !== '') {
							companyLoginLogo[0].classList.add('hide');

							let img = document.createElement('img');
							img.src = url;

							companyLoginLogo[0].parentNode.insertBefore(img, companyLoginLogo.nextSibling);
						}
					}, 0);
				}
			};
		}]
	);
})(angular);
