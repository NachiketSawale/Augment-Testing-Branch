/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).controller('controllingControllingunittemplateListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, '201b468b575042a090e366d830c5a60d');

				$scope.$on('$destroy', function () {
				});
			}
		]);

	angular.module(moduleName).controller('controllingControllingunittemplateDetailController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'a16785bd94a8441f9f4e6fb5798a7112', 'controllingControllingunittemplateTranslationService');
			}
		]);
})(angular);
