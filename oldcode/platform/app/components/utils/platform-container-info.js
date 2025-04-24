/**
 * Created by balkanci and alisch on 16.11.2015.
 */
(function (angular) {
	/* global angular */
	'use strict';

	/**
	 * Created by balkanci and alisch on 16.11.2015.
	 */
	/**
	 * @ngdoc directive
	 * @name platform.directive:platformContainerInfo
	 * @restrict A
	 * @priority default value
	 * @scope isolate scope
	 * @description
	 * Standardized info bar to inform user. It is possible to set different rows (with title label) by setting an array object.
	 *
	 * @example
	 * <div data-platform-container-info data-messages="myMessages"></div>
	 */
	angular.module('platform').directive('platformContainerInfo', [function () {

		return {
			restrict: 'A',
			templateUrl: 'app/components/base/partials/container-info-template.html',
			scope: {
				messages: '='
			}
		};
	}]);
})(angular);







