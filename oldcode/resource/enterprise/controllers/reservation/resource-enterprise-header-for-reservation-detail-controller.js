/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseHeaderForReservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of header being assigned to reservations
	 **/
	angular.module(moduleName).controller('resourceEnterpriseHeaderForReservationDetailController', ResourceEnterpriseHeaderForReservationDetailController);

	ResourceEnterpriseHeaderForReservationDetailController.$inject = ['$scope', 'platformContainerControllerService','resourceEnterpriseContainerInformationService', 'resourceEnterpriseHeaderForReservationContainerService'];

	function ResourceEnterpriseHeaderForReservationDetailController($scope, platformContainerControllerService, resourceEnterpriseContainerInformationService, resourceEnterpriseHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceEnterpriseContainerInformationService.hasDynamic(containerUid)) {
			resourceEnterpriseHeaderForReservationContainerService.prepareDetailConfig(containerUid, $scope, resourceEnterpriseContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);