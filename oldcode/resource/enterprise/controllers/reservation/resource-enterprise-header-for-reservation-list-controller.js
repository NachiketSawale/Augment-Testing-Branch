/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseHeaderForReservationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('resourceEnterpriseHeaderForReservationListController', ResourceEnterpriseHeaderForReservationListController);

	ResourceEnterpriseHeaderForReservationListController.$inject = ['$scope', 'platformContainerControllerService','resourceEnterpriseContainerInformationService', 'resourceEnterpriseHeaderForReservationContainerService'];

	function ResourceEnterpriseHeaderForReservationListController($scope, platformContainerControllerService, resourceEnterpriseContainerInformationService, resourceEnterpriseHeaderForReservationContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!resourceEnterpriseContainerInformationService.hasDynamic(containerUid)) {
			resourceEnterpriseHeaderForReservationContainerService.prepareGridConfig(containerUid, $scope, resourceEnterpriseContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);