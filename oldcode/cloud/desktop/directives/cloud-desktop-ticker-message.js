(function () {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopTickerMessage', cloudDesktopTickerMessage);

	function cloudDesktopTickerMessage() {
		return {
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/cloud-desktop-ticker-message.html',
			link: function (scope, elem) {
				scope.minutes = scope.applicationAlert.minutestogo;

				if (scope.minutes > 0) {
					/*
					toggle between LogOff-Container and ticker
					 */
					angular.element('.js-main-content').click(function () {
						angular.element(this).toggleClass('log-off-container');
					});

					var seconds = 59;

					var count = setInterval(function () {

						if (parseInt(scope.minutes) === 0) {
							scope.minutes = 0;
							// clear interval
							clearInterval(count);

							// logout from application
							scope.onLogout();
						} else {
							if (seconds === 0) {
								scope.minutes--;

								seconds = 59;
							}
							seconds--;
						}

						if (parseInt(scope.minutes) === 15) {
							hideTickerContainer();
						}

						if (parseInt(scope.minutes) === 5) {
							changeColorForLogOffContainer();
						}
					}, 1000);
				}

				function hideTickerContainer() {
					/*
					If the rejection is 15 minutes before logging off, the text notification will prevent
					the countdown display. Switching back with a mouse click is no longer possible
					 */
					angular.element('.js-main-content').addClass('log-off-container');
					angular.element('.js-main-content').unbind('click');
				}

				// If there are 5 minutes remaining, the color will be changed
				function changeColorForLogOffContainer() {
					angular.element(elem).find('.maintenance-background').addClass('red');
				}
			}
		};
	}
})();