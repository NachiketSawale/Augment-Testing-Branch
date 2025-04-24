/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectHeaderForReservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of header being assigned to reservations
	 **/
	angular.module(moduleName).controller('resourceProjectHeaderForReservationDetailController', ResourceProjectHeaderForReservationDetailController);

	ResourceProjectHeaderForReservationDetailController.$inject = ['$scope', 'platformContainerControllerService','resourceProjectContainerInformationService', 'resourceProjectHeaderForReservationContainerService'];

	function ResourceProjectHeaderForReservationDetailController($scope, platformContainerControllerService, resourceProjectContainerInformationService, resourceProjectHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceProjectContainerInformationService.hasDynamic(containerUid)) {
			resourceProjectHeaderForReservationContainerService.prepareDetailConfig(containerUid, $scope, resourceProjectContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);