/**
 * Created by cakiral on 09.06.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseReservationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource enterprise reservation entities.
	 **/

	angular.module(moduleName).controller('resourceEnterpriseReservationListController', ResourceEnterpriseReservationListController);

	ResourceEnterpriseReservationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEnterpriseReservationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2eea8976a98d11eabb370242ac130002');
	}
})(angular);