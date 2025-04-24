/**
 * Created by zwz on 01/18/2022.
 */

(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionplanningProductBookStockLocationWizardController', Controller);
	Controller.$inject = ['$scope', '$options', 'productionplanningProductBookStockLocationWizardService', 'platformGridAPI'];

	function Controller($scope, $options, wizardService, platformGridAPI) {
		wizardService.initial($scope, $options);

		$scope.$on('$destroy', function () {
			//  reproductionWizardService.destroy();
		});

		setTimeout(function () {
			//console.log('resize grid of BookStockLocationWizard');
		    platformGridAPI.grids.resize($scope.grid.state);
		}, 200);
	}

})(angular);