(function () {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainAffectedByChangeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('changeMainAffectedByChangeListController', ChangeMainAffectedByChangeListController);

	ChangeMainAffectedByChangeListController.$inject = ['$scope', 'platformContainerControllerService','changeMainContainerInformationService', 'changeMainAffectedByChangeContainerService'];

	function ChangeMainAffectedByChangeListController($scope, platformContainerControllerService, changeMainContainerInformationService, changeMainAffectedByChangeContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		//Here we have more effort than it is necessary. We should get rid of the true in the if.
		//The reason for introducing the true, was to force the recreate in order to get the
		//toolbar updated.
		//if(true || !changeMainContainerInformationService.hasDynamic(containerUid)) {
		changeMainAffectedByChangeContainerService.prepareGridConfig(containerUid, $scope, changeMainContainerInformationService);
		//}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
