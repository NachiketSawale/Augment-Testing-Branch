/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).controller('controllingControllingunittemplateGroupListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, 'a3aaf163058647c0872d13d0d2cd1c3d');

				$scope.$on('$destroy', function () {
				});
			}
		]);

	angular.module(moduleName).controller('controllingControllingunittemplateGroupDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'e062e5cb80894fd8abf2949ab1c164bb', 'controllingControllingunittemplateTranslationService');
			}
		]);
})(angular);
