/**
 * Created by Sudarshan on 14.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertifiedEmployeeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of certified employee entities.
	 **/

	angular.module(moduleName).controller('timekeepingCertifiedEmployeeListController', TimekeepingCertifiedEmployeeListController);

	TimekeepingCertifiedEmployeeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCertifiedEmployeeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e69fc5da946948f1abaa204629a91067');

		let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});
		$scope.tools.items.splice(createBtnIdx, 1);
	}
})(angular);