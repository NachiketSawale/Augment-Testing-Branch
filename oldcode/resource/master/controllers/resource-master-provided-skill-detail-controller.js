/**
 * Created by baf on 04.10.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource master provided skill entities.
	 **/
	angular.module(moduleName).controller('resourceMasterProvidedSkillDetailController', ResourceMasterProvidedSkillDetailController);

	ResourceMasterProvidedSkillDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillDetailController($scope, platformContainerControllerService, values) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.providedSkillDetail);
	}

})(angular);