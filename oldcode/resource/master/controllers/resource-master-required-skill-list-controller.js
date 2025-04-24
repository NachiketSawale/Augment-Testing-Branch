/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterRequiredSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource master required skill entities.
	 **/

	angular.module(moduleName).controller('resourceMasterRequiredSkillListController', ResourceMasterRequiredSkillListController);

	ResourceMasterRequiredSkillListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues'];

	function ResourceMasterRequiredSkillListController($scope, platformContainerControllerService, values) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.requiredSkillList);
	}
})(angular);