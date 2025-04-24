/**
 * Created by reimer on 06.06.2016.
 */
/**
 * @ngdoc directive
 * @name cloudDesktopModalBackground
 * @element div
 * @restrict A
 * @priority default value
 * @description sets display mode of modalBackground class; listen to modalBackgroundChanged of rootScope; not for public use!
 * @example
 * see cloudDesktopModalBackgroundService
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopModalBackground', ['$rootScope',
		function ($rootScope) {
			return {
				restrict: 'A',
				link: function (scope, element) {

					$rootScope.$on('modalBackgroundChanged', function (event, state) {
						// var element = angular.element(document.querySelector('#modalBackground'));
						element.css('display', state === true ? 'block' : 'none');
					});

				}
			};
		}]
	);
})(angular);

