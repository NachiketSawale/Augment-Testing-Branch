/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertificateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping certificate entities.
	 **/
	angular.module(moduleName).controller('timekeepingCertificateDetailController', TimekeepingCertificateDetailController);

	TimekeepingCertificateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCertificateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1c474c77cb944482833296349056c317');
	}

})(angular);