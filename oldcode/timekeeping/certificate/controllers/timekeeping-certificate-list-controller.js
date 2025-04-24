/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertificateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping certificate entities.
	 **/

	angular.module(moduleName).controller('timekeepingCertificateListController', TimekeepingCertificateListController);

	TimekeepingCertificateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCertificateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c9420131ec4a48a1a6524c4927252f47');
	}
})(angular);