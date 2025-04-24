/**
 * Created by shen on 11.04.2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectProjectRequisitionsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project requisitions entities.
	 **/

	angular.module(moduleName).controller('resourceProjectProjectRequisitionsListController', ResourceProjectProjectRequisitionsListController);

	ResourceProjectProjectRequisitionsListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectProjectRequisitionsListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '29928bb3fcde4b659112c8bdba3c9aaa');
	}
})(angular);