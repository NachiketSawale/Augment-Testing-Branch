/**
 * Created by baf on 30.10.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc controller
	 * @name resourceRequisitionRequiredSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource requisition requiredSkill entities.
	 **/
	angular.module(moduleName).controller('resourceRequisitionRequiredSkillDetailController', ResourceRequisitionRequiredSkillDetailController);

	ResourceRequisitionRequiredSkillDetailController.$inject = ['$scope', 'resourceRequisitionConstantValues', 'platformContainerControllerService'];

	function ResourceRequisitionRequiredSkillDetailController($scope, resourceRequisitionConstantValues, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, resourceRequisitionConstantValues.uuid.container.requiredSkillDetail);
	}

})(angular);