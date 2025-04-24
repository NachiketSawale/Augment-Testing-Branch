/**
 * Created by shen on 3/24/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyProjectGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Project Group ProjectGroup entities.
	 **/

	angular.module(moduleName).controller('basicsCompanyProjectGroupDetailController', BasicsCompanyProjectGroupDetailController);

	BasicsCompanyProjectGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyProjectGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c1592f6e58514d3e904e9e5a4a046e35');
	}
})(angular);