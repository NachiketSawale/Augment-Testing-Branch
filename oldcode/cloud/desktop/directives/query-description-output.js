(function (angular) {
	'use strict';

	function cloudDesktopQueryDescriptionOutput($templateCache) {
		return {
			restrict: 'A',
			scope: {
				info: '='
			},
			template: $templateCache.get('query-description-output.html')
		};
	}

	cloudDesktopQueryDescriptionOutput.$inject = ['$templateCache'];

	angular.module('cloud.desktop').directive('cloudDesktopQueryDescriptionOutput', cloudDesktopQueryDescriptionOutput);
})(angular);