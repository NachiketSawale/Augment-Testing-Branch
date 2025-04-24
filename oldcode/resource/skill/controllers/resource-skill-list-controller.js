/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc controller
	 * @name resourceSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource skill  entities.
	 **/

	angular.module(moduleName).controller('resourceSkillListController', ResourceSkillListController);

	ResourceSkillListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceSkillListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '42e6d32d1ea343e5b0558a0394bfd3f7');
	}
})(angular);