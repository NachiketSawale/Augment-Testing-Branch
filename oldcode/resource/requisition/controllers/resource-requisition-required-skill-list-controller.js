/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionRequiredSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource requisition required skill entities.
	 **/

	angular.module(moduleName).controller('resourceRequisitionRequiredSkillListController', ResourceRequisitionRequiredSkillListController);

	ResourceRequisitionRequiredSkillListController.$inject = ['$scope', 'resourceRequisitionConstantValues', 'platformContainerControllerService'];

	function ResourceRequisitionRequiredSkillListController($scope, resourceRequisitionConstantValues, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, resourceRequisitionConstantValues.uuid.container.requiredSkillList);
	}
})(angular);