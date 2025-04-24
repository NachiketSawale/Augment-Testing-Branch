(function (angular) {

	'use strict';
	var moduleName = 'resource.requisition';
	/**
	 * @ngdoc controller
	 * @name resourceRequisitionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of requisition entities.
	 **/
	angular.module(moduleName).controller('resourceRequisitionDetailController', ResourceRequisitionDetailController);

	ResourceRequisitionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceRequisitionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '44398421b57043bc906469bf7b9991eb', 'resourceRequisitionTranslationService');
	}

})(angular);