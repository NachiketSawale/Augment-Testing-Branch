(function () {

	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainObject3DListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('modelMainObject3DListController', ModelMainObject3DListController);

	ModelMainObject3DListController.$inject = ['$scope','platformContainerControllerService'];
	function ModelMainObject3DListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '97617FBA4D674F25B27BE7749B3D9C95');
	}
})();