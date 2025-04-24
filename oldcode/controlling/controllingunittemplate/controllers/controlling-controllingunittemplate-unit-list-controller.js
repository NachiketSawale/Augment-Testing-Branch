
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).controller('controllingControllingunittemplateUnitListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, '0f64dd41abe541a5ba4470f605373b2c');

				$scope.$on('$destroy', function () {
				});
			}
		]);
})(angular);
