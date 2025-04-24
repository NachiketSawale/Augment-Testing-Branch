/**
 * Created by henkel
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource master provided skill document entities.
	 **/
	angular.module(moduleName).controller('resourceMasterProvidedSkillDocumentDetailController', ResourceMasterProvidedSkillDocumentDetailController);

	ResourceMasterProvidedSkillDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillDocumentDetailController($scope, platformContainerControllerService, values) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.providedSkillDocumentDetail);
	}

})(angular);