/**
 * Created by shen on 28.01.2025
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectExecPlannerItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resourceProjectExecPlannerItem entities.
	 **/

	angular.module(moduleName).controller('resourceProjectExecPlannerItemDetailController', ResourceProjectExecPlannerItemDetailController);

	ResourceProjectExecPlannerItemDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectExecPlannerItemDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '35372760dd5111ef9cd20242ac120002');
	}
})(angular);