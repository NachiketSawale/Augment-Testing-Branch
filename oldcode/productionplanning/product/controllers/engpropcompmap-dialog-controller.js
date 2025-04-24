/**
 * Created by zwz on 03/15/2022.
 */

(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).controller('productionplanningProductEngProdCompMapDialogController', Controller);
	Controller.$inject = ['$scope', '$options', 'productionplanningProductEngProdCompMapDialogService', 'platformGridAPI'];

	function Controller($scope, $options, dialogService, platformGridAPI) {
		dialogService.initial($scope, $options);


		setTimeout(function () {
			console.log('resize grid of ProductEngProdCompMapDialog');
		    platformGridAPI.grids.resize($scope.grid.state);
		}, 200);
	}

})(angular);