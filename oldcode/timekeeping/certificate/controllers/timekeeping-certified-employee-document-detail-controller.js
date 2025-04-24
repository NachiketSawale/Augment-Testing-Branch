/**
 * Created by Sudarshan on 27.03.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertificateEmployeeDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping certificate document entities.
	 **/
	angular.module(moduleName).controller('timekeepingCertificateEmployeeDocumentDetailController', TimekeepingCertificateEmployeeDocumentDetailController);

	TimekeepingCertificateEmployeeDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCertificateEmployeeDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6e476e45fc076573698722593466n523');
	}

})(angular);