/**
 * Created by baf on 16.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc controller
	 * @name resourceComponentTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource component type  entities.
	 **/

	angular.module(moduleName).controller('resourceComponentTypeListController', ResourceComponentTypeListController);

	ResourceComponentTypeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceComponentTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7b66904e63404334a7c1930a1f6ffd82');
	}
})(angular);