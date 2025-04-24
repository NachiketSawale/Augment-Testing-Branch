/**
 * Created by shen on 28.01.2025
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectExecPlannerItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resourceProjectExecPlannerItem entities.
	 **/

	angular.module(moduleName).controller('resourceProjectExecPlannerItemListController', ResourceProjectExecPlannerItemListController);

	ResourceProjectExecPlannerItemListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectExecPlannerItemListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '522a94a9206c4d02b714cb628ffc3957');
	}
})(angular);