/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc controller
	 * @name resourceSkillChainListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource skill chain entities.
	 **/

	angular.module(moduleName).controller('resourceSkillChainListController', ResourceSkillChainListController);

	ResourceSkillChainListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceSkillChainListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0aa9dbc6d88744e2adc1d08e85e9361b');
	}
})(angular);