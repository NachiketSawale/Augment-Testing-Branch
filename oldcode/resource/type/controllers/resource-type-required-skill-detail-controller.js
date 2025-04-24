/**
 * Created by baf on 03.12.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypeRequiredSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource type requested Skill view entities.
	 **/
	angular.module(moduleName).controller('resourceTypeRequiredSkillDetailController', ResourceTypeRequiredSkillDetailController);

	ResourceTypeRequiredSkillDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypeRequiredSkillDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a6e1e8208327420f85aa92585f851aee');
	}

})(angular);