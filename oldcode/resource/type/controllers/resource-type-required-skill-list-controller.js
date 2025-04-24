/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequiredSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource type requiredSkill entities.
	 **/

	angular.module(moduleName).controller('resourceTypeRequiredSkillListController', ResourceTypeRequiredSkillListController);

	ResourceTypeRequiredSkillListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequiredSkillListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a0b5aa1be8524f48b1796a06b9ce3e77');
	}
})(angular);