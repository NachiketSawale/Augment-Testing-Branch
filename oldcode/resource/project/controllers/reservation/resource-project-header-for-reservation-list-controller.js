/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectHeaderForReservationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('resourceProjectHeaderForReservationListController', ResourceProjectHeaderForReservationListController);

	ResourceProjectHeaderForReservationListController.$inject = ['$scope', 'platformContainerControllerService','resourceProjectContainerInformationService', 'resourceProjectHeaderForReservationContainerService'];

	function ResourceProjectHeaderForReservationListController($scope, platformContainerControllerService, resourceProjectContainerInformationService, resourceProjectHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceProjectContainerInformationService.hasDynamic(containerUid)) {
			resourceProjectHeaderForReservationContainerService.prepareGridConfig(containerUid, $scope, resourceProjectContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);