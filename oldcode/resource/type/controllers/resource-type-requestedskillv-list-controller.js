/**
 * Created by shen on 1/18/2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequestedSkillVListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource type requested skill view entities.
	 **/

	angular.module(moduleName).controller('resourceTypeRequestedSkillVListController', ResourceTypeRequestedSkillVListController);

	ResourceTypeRequestedSkillVListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequestedSkillVListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '29e4435b181f41ada329d9c6874867e7');
	}
})(angular);