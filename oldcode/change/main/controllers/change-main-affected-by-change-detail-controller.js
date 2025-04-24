(function () {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainAffectedByChangeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('changeMainAffectedByChangeDetailController', ChangeMainAffectedByChangeDetailController);

	ChangeMainAffectedByChangeDetailController.$inject = ['$scope', 'platformContainerControllerService','changeMainContainerInformationService', 'changeMainAffectedByChangeContainerService'];

	function ChangeMainAffectedByChangeDetailController($scope, platformContainerControllerService, changeMainContainerInformationService, changeMainAffectedByChangeContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!changeMainContainerInformationService.hasDynamic(containerUid)) {
			changeMainAffectedByChangeContainerService.prepareDetailConfig(containerUid, $scope, changeMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid, 'changeMainTranslationService');
	}
})();