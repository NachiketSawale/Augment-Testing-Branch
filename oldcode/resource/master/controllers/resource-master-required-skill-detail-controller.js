/**
 * Created by baf on 04.10.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterRequiredSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource master required skill entities.
	 **/
	angular.module(moduleName).controller('resourceMasterRequiredSkillDetailController', ResourceMasterRequiredSkillDetailController);

	ResourceMasterRequiredSkillDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues'];

	function ResourceMasterRequiredSkillDetailController($scope, platformContainerControllerService, values) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.requiredSkillDetail);
	}

})(angular);