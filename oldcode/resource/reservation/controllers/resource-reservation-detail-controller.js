(function (angular) {

	'use strict';
	var moduleName = 'resource.reservation';
	/**
	 * @ngdoc controller
	 * @name resourceReservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of reservation entities.
	 **/
	angular.module(moduleName).controller('resourceReservationDetailController', ResourceReservationDetailController);

	ResourceReservationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceReservationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f1c290f9673c4ed2af8893510f93f6a5', 'resourceReservationTranslationService');
	}

})(angular);