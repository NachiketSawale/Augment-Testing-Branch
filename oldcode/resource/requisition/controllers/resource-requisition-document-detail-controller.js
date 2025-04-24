/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.requisition';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of document entities
	 **/
	angModule.controller('resourceRequisitionDocumentDetailController', ResourceRequisitionDocumentDetailController);

	ResourceRequisitionDocumentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceRequisitionDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'abe36123a4874eb3bc6c2c26da5ac374');
	}
})();