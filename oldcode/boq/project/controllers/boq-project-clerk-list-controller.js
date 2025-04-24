/**
 * Created by mangeshk on 11.04.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'boq.project';

	/**
	 * @ngdoc controller
	 * @name boqProjectClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of boq project clerk entities.
	 **/

	angular.module(moduleName).controller('boqProjectClerkListController', BoqProjectClerkListController);

	BoqProjectClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BoqProjectClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c1fc5b2e7f6f47bdabaef27a7dfe05f1');
	}
})(angular);