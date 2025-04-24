/**
 * Created by wui on 1/15/2015.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonImagePreview', ['$timeout', 'globals',
		function ($timeout, globals) {

			return {
				restrict: 'A',
				scope: true,
				templateUrl: globals.appBaseUrl + 'basics.common/templates/image-preview.html',
				link: function ($scope, $element, $attrs) {
					if (angular.isDefined($attrs.image)) {
						const image = angular.element($scope.$parent.$eval($attrs.image)).clone();

						$timeout(function () {
							$element.find('.image-preview').append(image);
						}, 0, false);
					}
				}
			};

		}
	]);

})(angular);