/**
 * Created by baf on 03.10.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc controller
	 * @name resourceSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource skill  entities.
	 **/
	angular.module(moduleName).controller('resourceSkillDetailController', ResourceSkillDetailController);

	ResourceSkillDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceSkillDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c6c4abc54c5b432aa8cdee1b4b4030a3');
	}

})(angular);