/**
 * Created by baf on 07.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc controller
	 * @name objectMainUnitInstallmentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of object main unitInstallment entities.
	 **/

	angular.module(moduleName).controller('objectMainUnitInstallmentListController', ObjectMainUnitInstallmentListController);

	ObjectMainUnitInstallmentListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitInstallmentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '47048c5b099c46288cb3d85b3c656f8f');
	}
})(angular);