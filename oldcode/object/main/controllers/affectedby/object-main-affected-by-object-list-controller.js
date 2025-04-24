(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc controller
	 * @name objectMainAffectedByObjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('objectMainAffectedByObjectListController', ObjectMainAffectedByObjectListController);

	ObjectMainAffectedByObjectListController.$inject = ['$scope', 'platformContainerControllerService','objectMainContainerInformationService', 'objectMainAffectedByObjectContainerService'];

	function ObjectMainAffectedByObjectListController($scope, platformContainerControllerService, objectMainContainerInformationService, objectMainAffectedByObjectContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		//Here we have more effort than it is necessary. We should get rid of the true in the if.
		//The reason for introducing the true, was to force the recreate in order to get the
		//toolbar updated.
		//if(true || !objectMainContainerInformationService.hasDynamic(containerUid)) {
		objectMainAffectedByObjectContainerService.prepareGridConfig(containerUid, $scope, objectMainContainerInformationService);
		//}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);
