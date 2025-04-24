/**
 * Created by reimer on 02.06.2016.
 */

/**
 * @ngdoc service
 * @name cloudDesktopModalBackgroundService
 * @priority default value
 * @description
 *
 *
 *
 * @example
 ...
 }
 */
(function (angular) {
	'use strict';
	angular.module('cloud.desktop').factory('cloudDesktopModalBackgroundService', ['$rootScope',
		function ($rootScope) {

			var service = {};

			/**
			 * @ngdoc function
			 * @name setModalBackground
			 * @function Sets the readonly state of the actual browser tab
			 * @methodOf cloudDesktopModalBackgroundService
			 * @description
			 * @param {boolean} [state] true: sets the complete screen to readonly!
			 * @returns {}
			 */
			service.setModalBackground = function (state) {

				// var element = angular.element(document.querySelector('#modalBackground'));
				// element.css('display', state === true ? 'block' : 'none');
				$rootScope.$emit('modalBackgroundChanged', state);

			};

			return service;

		}]);
})(angular);


