/**
 * Created by baf on 04.07.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main costGroup entities.
	 **/
	angular.module(moduleName).controller('projectMainCostGroupDetailController', ProjectMainCostGroupDetailController);

	ProjectMainCostGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainCostGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '138ba13460d6421dac6566fb65076b2b');
	}

})(angular);