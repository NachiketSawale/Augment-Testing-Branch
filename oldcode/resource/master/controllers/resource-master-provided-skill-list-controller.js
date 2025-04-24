/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource master provided skill entities.
	 **/

	angular.module(moduleName).controller('resourceMasterProvidedSkillListController', ResourceMasterProvidedSkillListController);

	ResourceMasterProvidedSkillListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillListController($scope, platformContainerControllerService, values) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.providedSkillList);
	}
})(angular);