/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.reservation';

	/**
	 * @ngdoc controller
	 * @name resourceReservationHeaderForReservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of header being assigned to reservations
	 **/
	angular.module(moduleName).controller('resourceReservationHeaderForReservationDetailController', ResourceReservationHeaderForReservationDetailController);

	ResourceReservationHeaderForReservationDetailController.$inject = ['$scope', 'platformContainerControllerService','resourceReservationContainerInformationService', 'resourceReservationHeaderForReservationContainerService'];

	function ResourceReservationHeaderForReservationDetailController($scope, platformContainerControllerService, resourceReservationContainerInformationService, resourceReservationHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceReservationContainerInformationService.hasDynamic(containerUid)) {
			resourceReservationHeaderForReservationContainerService.prepareDetailConfig(containerUid, $scope, resourceReservationContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);