/**
 * Created by shen on 1/18/2024
 */

(function (angular) {

	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedSkillVDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource type requested skill view entities.
	 **/
	angular.module(moduleName).controller('resourceTypeRequestedSkillVDetailController', ResourceTypeRequestedSkillVDetailController);

	ResourceTypeRequestedSkillVDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequestedSkillVDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e87b97f59061480b9630a1880c340788');
	}

})(angular);