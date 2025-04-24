/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of activity entities.
	 **/

	angular.module(moduleName).controller('projectMainActivityListController', ProjectMainActivityListController);

	ProjectMainActivityListController.$inject = [
		'$scope', 'platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService', 'projectMainActivityDataService',
		'basicsCommonUploadDownloadControllerService'
	];

	function ProjectMainActivityListController(
		$scope, platformContainerControllerService,basicsCommonDocumentUploadFilesControllerService, projectMainActivityDataService,
		basicsCommonUploadDownloadControllerService
	) {
		platformContainerControllerService.initController($scope, moduleName, '2a107e4b607d4358892d1ed762495f8c');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,projectMainActivityDataService,'2a107e4b607d4358892d1ed762495f8c');

		basicsCommonUploadDownloadControllerService.initGrid($scope, projectMainActivityDataService);
	}
})(angular);