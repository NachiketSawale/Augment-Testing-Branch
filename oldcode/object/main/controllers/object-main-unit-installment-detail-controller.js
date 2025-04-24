/**
 * Created by baf on 07.02.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc controller
	 * @name objectMainUnitInstallmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of object main unitInstallment entities.
	 **/
	angular.module(moduleName).controller('objectMainUnitInstallmentDetailController', ObjectMainUnitInstallmentDetailController);

	ObjectMainUnitInstallmentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitInstallmentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '97d3218a1f574c0491a3a917064ac912');
	}

})(angular);