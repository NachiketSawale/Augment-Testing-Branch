(function () {

	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc controller
	 * @name objectMainAffectedByObjectDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('objectMainAffectedByObjectDetailController', ObjectMainAffectedByObjectDetailController);

    ObjectMainAffectedByObjectDetailController.$inject = ['$scope', 'platformContainerControllerService','objectMainContainerInformationService', 'objectMainAffectedByObjectContainerService'];

	function ObjectMainAffectedByObjectDetailController($scope, platformContainerControllerService, objectMainContainerInformationService, objectMainAffectedByObjectContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!objectMainContainerInformationService.hasDynamic(containerUid)) {
            objectMainAffectedByObjectContainerService.prepareDetailConfig(containerUid, $scope, objectMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid, 'objectMainTranslationService');
	}
})();