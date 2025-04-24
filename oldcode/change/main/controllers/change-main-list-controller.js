(function () {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name projectLocationReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	angular.module(moduleName).controller('changeMainListController', ChangeMainListController);

	ChangeMainListController.$inject = ['$scope','platformContainerControllerService'];
	function ChangeMainListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3aea93d116ae440eb92c414e817e3454');
	}
})();