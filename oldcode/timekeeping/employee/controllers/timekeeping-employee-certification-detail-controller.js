/**
 * Created by Sudarshan
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeCertificationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee certification entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeCertificationDetailController', TimekeepingEmployeeCertificationDetailController);

	TimekeepingEmployeeCertificationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeCertificationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '56v185feb13m77evgvb10659jh557801');
	}

})(angular);