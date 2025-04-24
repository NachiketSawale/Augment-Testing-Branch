/**
 * Created by leo on 18.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyICCuListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics company ic cu entities.
	 **/

	angular.module(moduleName).controller('basicsCompanyICCuListController', BasicsCompanyIcListController);

	BasicsCompanyIcListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyIcListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a4bfa1b188fa4732a7dea63c536a9959');
	}
})(angular);
