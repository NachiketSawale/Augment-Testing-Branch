/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.reservation';

	/**
	 * @ngdoc controller
	 * @name resourceReservationHeaderForReservationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('resourceReservationHeaderForReservationListController', ResourceReservationHeaderForReservationListController);

	ResourceReservationHeaderForReservationListController.$inject = ['$scope', 'platformContainerControllerService','resourceReservationContainerInformationService', 'resourceReservationHeaderForReservationContainerService'];

	function ResourceReservationHeaderForReservationListController($scope, platformContainerControllerService, resourceReservationContainerInformationService, resourceReservationHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceReservationContainerInformationService.hasDynamic(containerUid)) {
			resourceReservationHeaderForReservationContainerService.prepareGridConfig(containerUid, $scope, resourceReservationContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);