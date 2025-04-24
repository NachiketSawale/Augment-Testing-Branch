/**
 * Created by zwz on 07/04/2022.
 */

(function (angular) {
	'use strict';
	/*global angular, _ */
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionplanningProductReuseFromStockWizardController', Controller);
	Controller.$inject = ['$scope', '$options', 'productionplanningProductReuseFromStockWizardService', 'platformGridAPI'];

	function Controller($scope, $options, wizardService, platformGridAPI) {
		wizardService.initial($scope, $options);

		$scope.$on('$destroy', function () {
			//  reproductionWizardService.destroy();
		});

		// setTimeout(function () {
		// 	console.log('resize grid of ProductReuseFromStockWizard');
		// 	platformGridAPI.grids.resize($scope.grid.state);
		// }, 200);
	}

})(angular);