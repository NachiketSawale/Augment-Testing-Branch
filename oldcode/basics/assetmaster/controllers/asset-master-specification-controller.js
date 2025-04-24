(function config(angular) {

	'use strict';

	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc controller
	 * @name basicsAssetMasterSpecificationController
	 * @function
	 *
	 * @description
	 * Controller for the specification view of asset master
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsAssetMasterSpecificationController', ['$scope', 'basicsAssetMasterService', function basicsAssetMasterSpecificationController($scope, dataService) {

		$scope.getSelected = function getSelected() {
			return dataService.getSelected();
		};

		$scope.onPropertyChanged = function onPropertyChanged() {
			dataService.markCurrentItemAsModified();
		};
	}
	]);
})(angular);