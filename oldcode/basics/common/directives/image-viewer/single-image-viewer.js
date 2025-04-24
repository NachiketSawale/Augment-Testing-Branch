/**
 * @description: image viewer.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonSingleImageViewer', ['platformObjectHelper', function (platformObjectHelper) {
		return {
			restrict: 'A',
			scope: {
				options: '=imgOptions',
				blob: '=imgCurrent'
			},
			templateUrl: window.location.pathname + '/basics.common/templates/single-image-viewer.html',
			controller: ['$scope', 'basicsCommonUtilities', controller]
		};

		function controller(scope, basicsCommonUtilities) {
			scope.getImage = function (dataItem) {
				if (!scope.contentProperty) {
					throw new Error('Please bind img-content');
				}

				if (!dataItem) {
					// this can confirm display null when there is no blob content ,if not ,will display  last image
					return '//:0';
				}

				return basicsCommonUtilities.toImage(platformObjectHelper.getValue(dataItem, scope.contentProperty));
			};

			if (angular.isDefined(scope.options)) {
				angular.extend(scope, scope.options);
			}
		}
	}]);

})(angular);