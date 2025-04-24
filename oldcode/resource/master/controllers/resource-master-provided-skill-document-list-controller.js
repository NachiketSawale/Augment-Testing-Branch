/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource master provided skill document entities.
	 **/

	angular.module(moduleName).controller('resourceMasterProvidedSkillDocumentListController', ResourceMasterProvidedSkillDocumentListController);

	ResourceMasterProvidedSkillDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceMasterConstantValues', 'basicsCommonUploadDownloadControllerService', 'resourceMasterProvidedSkillDocumentDataService','basicsCommonDocumentUploadFilesControllerService'];

	function ResourceMasterProvidedSkillDocumentListController($scope, platformContainerControllerService, values, basicsCommonUploadDownloadControllerService, resourceMasterProvidedSkillDocumentDataService, basicsCommonDocumentUploadFilesControllerService) {
		platformContainerControllerService.initController($scope, moduleName, values.uuid.container.providedSkillDocumentList);

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope, resourceMasterProvidedSkillDocumentDataService, values.uuid.container.providedSkillDocumentList);

		basicsCommonUploadDownloadControllerService.initGrid($scope, resourceMasterProvidedSkillDocumentDataService);
	}
})(angular);