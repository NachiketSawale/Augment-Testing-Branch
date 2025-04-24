/**
 * Created by nitsche on 21.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainChange2ExternalListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of change main  entities.
	 **/

	angular.module(moduleName).controller('changeMainChange2ExternalListController', changeMainChange2ExternalListController);

	changeMainChange2ExternalListController.$inject = ['$scope', 'platformContainerControllerService'];

	function changeMainChange2ExternalListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1bdb594baf8443ac91e66456f5c93c2a');
	}
})(angular);