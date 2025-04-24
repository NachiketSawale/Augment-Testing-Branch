/**
 * Created by henkel on 15.09.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyPeriodsController', BasicsCompanyPeriodsController);

	BasicsCompanyPeriodsController.$inject = ['_', '$scope', 'platformContainerControllerService', 'basicsCompanyPeriodsService'];
	function BasicsCompanyPeriodsController(_, $scope, platformContainerControllerService, basicsCompanyPeriodsService) {

		var hasChildren;
		basicsCompanyPeriodsService.registerSelectionChanged(function () {

			if (basicsCompanyPeriodsService.getSelected() !== undefined && basicsCompanyPeriodsService.getSelected() !== null) {
				basicsCompanyPeriodsService.hasChildren().then(function (response) {
					hasChildren = response.data.length;
					if (hasChildren === 0) {
						_.find($scope.tools.items, {id: 'delete'}).disabled = false;
					} else {
						_.find($scope.tools.items, {id: 'delete'}).disabled = true;
					}
					$scope.tools.refresh();
				},
				function (/*error*/) {
				});
			}
		});

		platformContainerControllerService.initController($scope, moduleName, 'EC18C54522AA46FE9848F466875AA03C');
	}
})(angular);
