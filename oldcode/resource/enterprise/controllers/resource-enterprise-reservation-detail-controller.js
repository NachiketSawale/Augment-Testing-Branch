/**
 * Created by cakiral on 09.06.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseReservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource enterprise reservation entities.
	 **/
	angular.module(moduleName).controller('resourceEnterpriseReservationDetailController', ResourceEnterpriseReservationDetailController);

	ResourceEnterpriseReservationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEnterpriseReservationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '601c700ea98d11eabb370242ac130002');
	}

})(angular);